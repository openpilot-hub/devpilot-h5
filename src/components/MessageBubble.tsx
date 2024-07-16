import React, { useState, useEffect } from 'react'
import { Menu, Item, useContextMenu } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { ChatMessage, PluginCommand } from '../typings'
import Markdown from './Markdown'
import styled from 'styled-components'
import IconButton from './IconButton'
import Devpilot from '../assets/devpilot.svg'
import User from '../assets/user.svg'
import Loading from './Loading'
import { sendToPlugin } from '../services/pluginBridge'
import Time from './Time'
import CodeReference from './CodeReference'
import { useI18n } from '../i18n'
import CloseButton from './CloseButton'
import ErrorBoundary from './ErrorBoundary'
import { useTheme } from '@/themes/themes';

const MessageBubbleContainer = styled.div`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.msgBoxBG};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  position: relative;

  --contexify-menu-shadow: ${props => props.theme.contextMenuShadow};
  &:hover {
    .close-button {
      display: flex;
    }
  }
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

const Username = styled.span`
  font-weight: bold;
  margin-right: 10px;
`

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
`

const DividerContainer = styled.div`
  position: relative;
  width: calc(100% - 60px);
  height: 3px;
  border-radius: 5px;
  background-color: ${props => props.theme.msgBoxBG};
  color: ${props => props.theme.textFaint};
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
`

const Divider = styled.div`
  background-color: ${props => props.theme.msgBoxBG};
  padding: 1px 6px;
  border-radius: 5px;
`

const MessageBubble: React.FC<ChatMessage> = (message: ChatMessage) => {
  const { text, locale } = useI18n()
  const [liked, setLiked] = useState(false)
  const [disliked, setDisLiked] = useState(false)

  const theme = useTheme();

  let { username, avatar, content, role, time, id } = message;

  const MENU_ID = 'MESSAGE_BUBBLE_CONTEXT_MENU';
  
  const {show, hideAll} = useContextMenu({ id: MENU_ID });

  function handleContextMenu(event: any) {
    show({
      event,
      props: {
        key: 'value'
      }
    })
  }

  if (message.status === 'error') {
    content = (text.errorMessage as any)[content] || content;
  }

  avatar = avatar || (role === 'assistant' ? Devpilot : User)

  username = username ||
    (role === 'assistant' ? 'Devpilot' : role === 'user' ? 'User' : role === 'system' ? 'System' : '')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (content === '...') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [content])

  const copyThisMessage = () => {
    navigator?.clipboard?.writeText(content)
    sendToPlugin(PluginCommand.CopyCode, { content, messageId: id, role, language: 'text' })
  }

  const retryThisMessage = () => {
    sendToPlugin(PluginCommand.RegenerateMessage, message)
  }

  const likeThisMessage = () => {
    sendToPlugin(PluginCommand.LikeMessage, message)
    setLiked(true)
  }

  const dislikeThisMessage = () => {
    sendToPlugin(PluginCommand.DislikeMessage, message)
    setDisLiked(true)
  }

  const deleteMessage = () => {
    sendToPlugin(PluginCommand.DeleteMessage, message)
  }

  function codeblockActions(action: PluginCommand, content: string, lang: string, extra?: { [key: string]: string }) {
    sendToPlugin(action, { ...extra, content, messageId: id, lang, role });
  }

  const linkActions = (href: string): boolean => {
    switch (href) {
      case '#/fix':
        sendToPlugin(PluginCommand.FixCode)
        return true
      case '#/explain':
        sendToPlugin(PluginCommand.ExplainCode)
        return true
      case '#/comment':
        sendToPlugin(PluginCommand.CommentCode)
        return true
    }
    return false
  }

  if (role === 'divider') {
    return (
      <DividerContainer>
        <Divider>{text.contextCleared}</Divider>
      </DividerContainer>
    )
  }

  return (
    <MessageBubbleContainer onContextMenu={handleContextMenu}>
      {message.actions.includes('delete') &&
        <CloseButton onClick={deleteMessage} />}
      <HeaderContainer>
        <Avatar src={avatar} alt={username} className="avatar" />
        <RightSide>
          <Username>{username}</Username>
          <Time date={time} locale={locale} />
        </RightSide>
      </HeaderContainer>
      <ActionBar>
        {message.actions.includes('regenerate') &&
          <IconButton type='fade' icon='retry' title={text.retryMsg} onClick={retryThisMessage} />}
        {message.actions.includes('copy') &&
          <IconButton type='fade' icon='copy' title={text.copyMsg} onClick={copyThisMessage} />}
        {message.actions.includes('like') && !disliked &&
          <IconButton type='activable' icon='like' title={text.likeMsg} onClick={likeThisMessage} />}
        {message.actions.includes('dislike') && !liked &&
          <IconButton type='activable' icon='dislike' title={text.dislikeMsg} onClick={dislikeThisMessage} />}
      </ActionBar>
      <ErrorBoundary>
        {isLoading
          ? <Loading />
          : <>
            <Markdown
              markdown={content}
              codeblockActions={codeblockActions}
              linkActions={linkActions}
            />
            {message.codeRef &&
              <CodeReference {...message.codeRef} />
            }
          </>
        }
      </ErrorBoundary>
      <Menu id={MENU_ID} theme={theme} animation={false}>
        <Item id="regenerate" onClick={() => {
          retryThisMessage();
          hideAll();
        }}>{text.retryMsg}</Item>
        <Item id="copy" onClick={() => {
          copyThisMessage();
          hideAll();
        }}>{text.copyMsg}</Item>
        <Item id="like" onClick={() => {
          likeThisMessage();
          hideAll();
        }}>{text.likeMsg}</Item>
        <Item id="dislike" onClick={() => {
          dislikeThisMessage();
          hideAll();
        }}>{text.dislikeMsg}</Item>
      </Menu>
    </MessageBubbleContainer>
  )
}

export default MessageBubble
