import { logger } from '@/utils/logger';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import InputBox from '../components/InputBox';
import MessageBubble from '../components/MessageBubble';
import StopButton from '../components/StopButton';
import { useI18n } from '../i18n';
import { assembleActionsToMessages, createUserMessage, createWelcomeMessage, useMessages } from '../services/messages';
import { sendToPlugin, usePluginState } from '../services/pluginBridge';
import { QuickCommand } from '../typings';

const MessageStack = styled.div`
  overflow-y: auto;
  padding: 10px 10px 50px;
  flex: 1;
`;

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
  }, [messages[messages.length - 1]?.id]);

  // useEffect(() => {
  //   // @ts-ignore
  //   window.__SERAPH_HAS_MONITOR__?.setUser({ userId: username });
  // }, [username]);

  if (!messages.length) {
    messages = [createWelcomeMessage(text, username)];
  }

  logger.log('current messages =>', messages);

  messages = assembleActionsToMessages(messages, streaming);

  return (
    <>
      <MessageStack ref={messageStackRef} className="message-stack hide-scrollbar">
        {messages.map((msg, index) => (
          <MessageBubble key={msg.id + String(index)} message={msg} />
        ))}
      </MessageStack>
      <InputBox
        disabled={streaming}
        quickCommands={quickCommands}
        onSend={(pluginCommand, msg) => {
          if (streaming) return;
          if (pluginCommand) {
            sendToPlugin(pluginCommand, msg);
          } else if (msg?.content) {
            sendMessage(createUserMessage(msg?.content, msg));
          }
        }}
      >
        {streaming && <StopButton onClick={interrupMessageStream} />}
      </InputBox>
    </>
  );
};

export default Chat;
