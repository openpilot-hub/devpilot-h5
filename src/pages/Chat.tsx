import React, { useEffect, useRef } from 'react'
import { FaRegStopCircle } from "react-icons/fa";
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
  background: ${props => props.theme.background};
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

const StopButtonContainer = styled.div`
  position: absolute;
  bottom: 60px;
  width: 100%;
  z-index: 100;
`
const StopButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100px;
  font-size: 16px;
  margin: 0 auto;
  background: ${props => props.theme.stopStreamBG};
  color: ${props => props.theme.text};
  height: 40px;
  outline: none;
`

const Chat: React.FC = () => {
  const { messages, sendMessage, interrupMessageStream } = useMessages()
  const messageStackRef = useRef<HTMLDivElement>(null)
  const streamming = messages[messages.length - 1]?.streaming

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
      {streamming &&
        <StopButtonContainer onClick={interrupMessageStream}>
          <StopButton>
            <FaRegStopCircle /> Stop
          </StopButton>
        </StopButtonContainer>
      }
    </>
  )
}

export default Chat
