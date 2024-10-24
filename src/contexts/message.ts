import { ChatMessage } from '@/typings';
import React, { useContext } from 'react';

export const MessageContext = React.createContext<ChatMessage>({} as ChatMessage);

export function useMessage() {
  return useContext(MessageContext);
}
