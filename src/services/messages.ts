import { Message } from "../typings";
import { useCallback, useEffect, useState } from 'react';
import { disposeHandler, receiveFromPlugin, sendToPlugin } from "./pluginBridge";

export const createUserMessage = (content: string, time?: string): Message => {
  return {
    content,
    role: 'user',
    username: 'John Doe',
    avatar: '',
    time: time ?? new Date().toISOString(),
  }
}

export const createAssistantMessage = (content: string, time?: string): Message => {
  return {
    content,
    role: 'assistant',
    username: 'DevPilot',
    avatar: '',
    time: time ?? new Date().toISOString(),
  }
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const sendMessage = useCallback((newMessage: Message) => {
    let newMessageStack = [...messages, newMessage]
    setMessages(newMessageStack);
    sendToPlugin('AppendToConversation', newMessage)
  }, [messages]);

  useEffect(() => {
    const handle = receiveFromPlugin(
      'RenderChatConversation',
      (messages) => setMessages(messages)
    )
    return () => disposeHandler(handle)
  }, [])
  return {messages, sendMessage}
}