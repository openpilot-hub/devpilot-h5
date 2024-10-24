import React, { useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';
import InputBox from '../components/Input';
import MessageBubble from '../components/MessageBubble';
import StopButton from '../components/StopButton';
import { useI18n } from '../i18n';
import { assembleActionsToMessages, createUserMessage, createWelcomeMessage, useMessages } from '../services/messages';
import { sendToPlugin, usePluginState } from '../services/pluginBridge';
import { ChatMessage, CodeReference, PluginCommand, QuickCommand } from '../typings';

const MessageStack = styled.div`
  overflow-y: auto;
  padding: 10px 10px 50px;
  flex: 1;
  background: ${({ theme: { background = '' } }) => background};
`;

const quickCommandMapping: Record<QuickCommand, PluginCommand> = {
  [QuickCommand.Clear]: PluginCommand.ClearChatHistory,
  [QuickCommand.Fix]: PluginCommand.FixCode,
  [QuickCommand.Explain]: PluginCommand.ExplainCode,
  [QuickCommand.Comment]: PluginCommand.CommentCode,
  [QuickCommand.Test]: PluginCommand.TestCode,
  // [QuickCommand.Performance]: PluginCommand.CheckCodePerformance,
};

const actQuickCommand = (value: QuickCommand, payload?: ChatMessage) => {
  if (quickCommandMapping[value]) {
    sendToPlugin(quickCommandMapping[value], payload);
    return true;
  }
  return false;
};

const Chat: React.FC = () => {
  const { text } = useI18n();
  const username = usePluginState('username');
  let { messages, sendMessage, interrupMessageStream } = useMessages();
  const messageStackRef = useRef<HTMLDivElement>(null);
  const streaming = messages[messages.length - 1]?.streaming;

  const quickCommands = Object.values(QuickCommand);

  useEffect(() => {
    if (messageStackRef.current) {
      messageStackRef.current.scrollTop = messageStackRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // @ts-ignore
    window.__SERAPH_HAS_MONITOR__?.setUser({ userId: username });
  }, [username]);

  if (!messages.length) {
    messages = [createWelcomeMessage(text, username)];
  }

  console.log('current messages =>', messages);

  messages = assembleActionsToMessages(messages, streaming);

  return (
    <>
      <MessageStack ref={messageStackRef} className="message-stack hide-scrollbar">
        {messages.map((msg, index) => (
          <MessageBubble key={msg.id + String(index)} {...msg} />
        ))}
      </MessageStack>
      <InputBox
        disabled={streaming}
        quickCommands={quickCommands}
        onSend={(value: string, codeRef?: CodeReference) => {
          if (streaming) return;
          if (actQuickCommand(value as QuickCommand, createUserMessage('', codeRef))) {
            return;
          }
          // 如果用户输入了标签，则替换掉
          value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          sendMessage(createUserMessage(value, codeRef));
        }}
      >
        {streaming && <StopButton onClick={interrupMessageStream} />}
      </InputBox>
      <Tooltip id="tooltip" />
    </>
  );
};

export default Chat;
