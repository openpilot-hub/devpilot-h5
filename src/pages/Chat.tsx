import React, { useEffect, useRef } from 'react'
import { Tooltip } from 'react-tooltip'
import MessageBubble from '../components/MessageBubble'
import { createUserMessage, useMessages, createWelcomeMessage, assembleActionsToMessages } from '../services/messages'
import styled from 'styled-components'
import Input from '../components/Input'
import { PluginCommand, QuickCommand } from '../typings';
import { sendToPlugin, usePluginState } from '../services/pluginBridge';
import { useI18n } from '../i18n';
import StopButton from '../components/StopButton';

const MessageStack = styled.div`
  overflow-y: auto;
  padding: 10px;
  padding-bottom: 50px;
  height: calc(100vh - 46px);
  background: ${({theme: {background = ''}}) => background};
  &::-webkit-scrollbar {
    width: 0;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const quickCommandMapping: Record<QuickCommand, PluginCommand> = {
  [QuickCommand.Clear]: PluginCommand.ClearChatHistory,
  [QuickCommand.Fix]: PluginCommand.FixCode,
  [QuickCommand.Explain]: PluginCommand.ExplainCode,
  [QuickCommand.Comment]: PluginCommand.CommentCode,
  [QuickCommand.Test]: PluginCommand.TestCode,
  [QuickCommand.Performance]: PluginCommand.CheckCodePerformance,
}

const actQuickCommand = (value: QuickCommand) => {
  if (quickCommandMapping[value]) {
    sendToPlugin(quickCommandMapping[value], {});
    return true;
  } else {
    return false;
  }
}

const Chat: React.FC = () => {
  const {text} = useI18n()
  const username = usePluginState('username')
  let { messages, sendMessage, interrupMessageStream } = useMessages()
  const messageStackRef = useRef<HTMLDivElement>(null)
  const stopBtnRef = useRef<HTMLDivElement>(null)
  const streaming = messages[messages.length - 1]?.streaming

  const quickCommands = Object.values(QuickCommand);
  
  useEffect(() => {
    if (messageStackRef.current) {
      messageStackRef.current.scrollTop = messageStackRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // @ts-ignore
    window.__SERAPH_HAS_MONITOR__?.setUser({ userId: username });
  }, [username]);

  if (messages.length === 0) {
    messages = [
      createWelcomeMessage(text, username)
    ]
  }

  messages = assembleActionsToMessages(messages, streaming)

  const onInputHeightChanged = (height: number) => {
    if (messageStackRef.current) {
      messageStackRef.current.style.height = `calc(100vh - ${height + 26}px)`
    }
    if (stopBtnRef.current) {
      stopBtnRef.current.style.bottom = `${height + 40}px`
    }
  }

  return (
    <>
      <MessageStack ref={messageStackRef}>
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            {...msg}
          />
        ))}
      </MessageStack>
      <Input
        quickCommands={quickCommands}
        onSend={(value: string) => {
          if (actQuickCommand(value as QuickCommand)) {
            return
          }
          sendMessage(createUserMessage(value))
        }}
        onHeightChanged={onInputHeightChanged}
      />
      {streaming &&
        <StopButton
          ref={stopBtnRef}
          onClick={interrupMessageStream}
        />
      }
      <Tooltip id="tooltip" />
    </>
  )
}

export default Chat
