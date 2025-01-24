import { ChatMessage } from '@/typings';
import { createContext, useContext } from 'react';

export const MessageContext = createContext<ChatMessage>({} as ChatMessage);

export function useMessage() {
  return useContext(MessageContext);
}
