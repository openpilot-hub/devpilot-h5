import { Message } from "../typings";
import { useCallback, useEffect, useState } from 'react';
import { isStandardalone, disposeHandler, receiveFromPlugin, sendToPlugin } from "./pluginBridge";
import { mockMessages } from "./mock";

export const createUserMessage = (content: string, time?: number): Message => {
  return {
    content,
    role: 'user',
    username: 'User',
    avatar: '',
    time: time ?? Date.now(),
    streaming: false,
  }
}

export const createAssistantMessage = (content: string, time?: number): Message => {
  return {
    content,
    role: 'assistant',
    username: 'DevPilot',
    avatar: '',
    time: time ?? Date.now(),
    streaming: false,
  }
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(isStandardalone() ? mockMessages() : []);
  
  const sendMessage = useCallback((newMessage: Message) => {
    let newMessageStack = [...messages, newMessage]
    setMessages(newMessageStack);
    sendToPlugin('AppendToConversation', newMessage)
  }, [messages]);

  const interrupMessageStream = useCallback(() => {
    sendToPlugin('InterrupMessageStream', {})
  }, []);

  useEffect(() => {
    const handle = receiveFromPlugin(
      'RenderChatConversation',
      (messages) => setMessages(messages)
    )
    return () => disposeHandler(handle)
  }, [])
  return {messages, sendMessage, interrupMessageStream}
}