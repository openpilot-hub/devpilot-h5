import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Message } from '../typings'
import MessageBubble from '../components/MessageBubble'
import { createUserMessage, useMessages } from '../services/messages'
import styled from 'styled-components'
import Input from '../components/Input'

const MessageStack = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  padding-bottom: 50px;
  height: calc(100vh - 30px);
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const Chat: React.FC = () => {
  const { messages, sendMessage } = useMessages()
  const messageStackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messageStackRef.current) {
      messageStackRef.current.scrollTop = messageStackRef.current.scrollHeight
    }
  }, [messages])

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
        onSend={(value: string) => {
          sendMessage(createUserMessage(value))
        }}
      />
    </>
  )
}

export default Chat
