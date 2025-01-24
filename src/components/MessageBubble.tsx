import { MessageContext } from '@/contexts/message';
import { Dropdown, MenuProps } from 'antd';
import { memo, useRef, useState } from 'react';
import styled from 'styled-components';
import Devpilot from '../assets/devpilot.svg';
import User from '../assets/user.svg';
import { useI18n } from '../i18n';
import { sendToPlugin } from '../services/pluginBridge';
import { ChatMessage, PluginCommand } from '../typings';
import CloseButton from './CloseButton';
import CodeRef from './CodeReference';
import ErrorBoundary from './ErrorBoundary';
import IconButton from './IconButton';
import Loading from './Loading';
import Markdown from './Markdown';
import Time from './Time';

const MessageBubbleContainer = styled.div`
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.msgBoxBG};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  position: relative;

  &:hover {
    .close-button {
      display: flex;
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Username = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
  @media (max-width: 253px) {
    .icon-button {
      visibility: hidden;
    }
  }
`;

const DividerContainer = styled.div`
  position: relative;
  width: calc(100% - 60px);
  height: 3px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.msgBoxBG};
  color: ${(props) => props.theme.textFaint};
  display: flex;
  margin: 30px 30px;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    .close-button {
      display: flex;
    }
  }
`;

const Divider = styled.div`
  background-color: ${(props) => props.theme.msgBoxBG};
  padding: 1px 6px;
  border-radius: 5px;
`;

const getSelectedText = () => {
  const selection = document.getSelection();
  if (selection) {
    const text = selection.toString();
    return text;
  }
  return '';
};

const userNameMap = {
  assistant: 'DevPilot',
  user: 'You',
  system: 'System',
  divider: 'Divider',
};

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const { text, locale } = useI18n();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisLiked] = useState(false);
  const selectionRef = useRef('');

  let { username, avatar, content, role, time, id, recall } = message;

  if (message.status === 'error') {
    content = (text.errorMessage as any)[content] || content;
  } else if (recall) {
    content = `<div class="thinking-process"></div>\n\n${content}`;
  }

  avatar = avatar || (role === 'assistant' ? Devpilot : User);
  username = username || userNameMap[role] || '';

  const isLoading = content === '...';

  const copyThisMessage = () => {
    const copyTarget = selectionRef.current || content;
    navigator?.clipboard?.writeText(copyTarget);
    sendToPlugin(PluginCommand.CopyCode, { content: copyTarget, messageId: id, role, language: 'text' });
  };

  const retryThisMessage = () => {
    sendToPlugin(PluginCommand.RegenerateMessage, message);
  };

  const likeThisMessage = () => {
    sendToPlugin(PluginCommand.LikeMessage, message);
    setLiked(true);
  };

  const dislikeThisMessage = () => {
    sendToPlugin(PluginCommand.DislikeMessage, message);
    setDisLiked(true);
  };

  const deleteMessage = () => {
    sendToPlugin(PluginCommand.DeleteMessage, message);
  };

  const onCopyTriggerEnter = () => {
    selectionRef.current = getSelectedText();
  };

  if (role === 'divider') {
    return (
      <DividerContainer>
        <Divider>{text.contextCleared}</Divider>
      </DividerContainer>
    );
  }

  const contextItems: MenuProps['items'] = [
    {
      label: text.retryMsg,
      key: 'regenerate',
      onClick: retryThisMessage,
    },
    {
      label: <span onMouseEnter={onCopyTriggerEnter}>{text.copyMsg}</span>,
      key: 'copy',
      onClick: copyThisMessage,
    },
    {
      label: text.likeMsg,
      key: 'like',
      onClick: likeThisMessage,
    },
    {
      label: text.dislikeMsg,
      key: 'dislike',
      onClick: dislikeThisMessage,
    },
  ];

  return (
    <MessageBubbleContainer onContextMenu={(e) => e.preventDefault()} className="message-bubble-container">
      <MessageContext.Provider value={message}>
        {message.actions.includes('delete') && <CloseButton onClick={deleteMessage} />}
        <HeaderContainer>
          <Avatar src={avatar} alt={username} className="avatar" />
          <RightSide>
            <Username>{username}</Username>
            <Time date={time} locale={locale} />
          </RightSide>
        </HeaderContainer>
        <ActionBar>
          {message.actions.includes('regenerate') && (
            <IconButton type="fade" icon="retry" title={text.retryMsg} onClick={retryThisMessage} />
          )}
          {message.actions.includes('copy') && (
            <IconButton type="fade" icon="copy" title={text.copyMsg} onMouseEnter={onCopyTriggerEnter} onClick={copyThisMessage} />
          )}
          {message.actions.includes('like') && !disliked && (
            <IconButton type="activable" icon="like" title={text.likeMsg} onClick={likeThisMessage} />
          )}
          {message.actions.includes('dislike') && !liked && (
            <IconButton type="activable" icon="dislike" title={text.dislikeMsg} onClick={dislikeThisMessage} />
          )}
        </ActionBar>
        {isLoading ? (
          <Loading />
        ) : (
          <ErrorBoundary>
            <Dropdown menu={{ items: contextItems }} trigger={['contextMenu']}>
              <div>
                <Markdown>{content}</Markdown>
                {message.codeRefs?.map((codeRef, index) => (
                  <CodeRef key={index} {...codeRef} />
                ))}
              </div>
            </Dropdown>
          </ErrorBoundary>
        )}
      </MessageContext.Provider>
    </MessageBubbleContainer>
  );
};

export default memo(MessageBubble);
