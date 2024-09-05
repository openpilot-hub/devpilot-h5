import { useCallback, useEffect, useState } from 'react';
import { Lang, useI18n } from '../i18n';
import { ChatMessage, ChatMessageAction, CodeReference, PluginCommand, QuickCommand } from '../typings';
import { mockMessages } from './mock';
import { disposeHandler, isStandardalone, receiveFromPlugin, sendToPlugin } from './pluginBridge';

export function assembleActionsToMessages(messages: ChatMessage[], loading: boolean): ChatMessage[] {
  const regen = (loading ? [] : ['regenerate']) as ChatMessageAction[];
  const del = (loading ? [] : ['delete']) as ChatMessageAction[];
  return messages.map((msg, index) => {
    msg.actions = msg.actions ?? [];
    if (msg.role === 'assistant' && index === 0) {
      return {
        ...msg,
        actions: [],
      };
    }
    if (msg.role === 'assistant') {
      if (index === messages.length - 1) {
        return {
          ...msg,
          actions: ['like', 'dislike', 'copy', ...regen],
        };
      } else {
        return {
          ...msg,
          actions: ['like', 'dislike', 'copy'],
        };
      }
    }
    if (msg.role === 'user') {
      return {
        ...msg,
        actions: ['copy', ...del],
      };
    }
    return { ...msg };
  });
}

export const createUserMessage = (content: string, codeRef?: CodeReference): ChatMessage => {
  if (content === QuickCommand.Clear) {
    return {
      id: Math.random().toString(36).substring(7),
      status: 'ok',
      content,
      role: 'divider',
      username: '',
      avatar: '',
      time: Date.now(),
      streaming: false,
      actions: [],
      codeRef,
    };
  }
  return {
    id: Math.random().toString(36).substring(7),
    status: 'ok',
    content,
    role: 'user',
    username: 'User',
    avatar: '',
    time: Date.now(),
    streaming: false,
    actions: [],
    codeRef,
  };
};

export const createWelcomeMessage = (text: Lang, username: string): ChatMessage => {
  return {
    id: Math.random().toString(36).substring(7),
    status: 'ok',
    content: text.welcome.replace('{{USER}}', username),
    role: 'assistant',
    username: 'DevPilot',
    avatar: '',
    time: Date.now(),
    streaming: false,
    actions: [],
  };
};

export const createAssistantMessage = (content: string, streaming: boolean = false): ChatMessage => {
  return {
    id: Math.random().toString(36).substring(7),
    status: 'ok',
    content,
    role: 'assistant',
    username: 'DevPilot',
    avatar: '',
    time: Date.now(),
    streaming,
    actions: [],
  };
};

export const createDividerMessage = (): ChatMessage => {
  return {
    id: Math.random().toString(36).substring(7),
    status: 'ok',
    content: '',
    role: 'divider',
    username: '',
    avatar: '',
    time: Date.now(),
    streaming: false,
    actions: [],
  };
};

export function useMessages() {
  const { text } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const mockMsgs = mockMessages(text);

  useEffect(() => {
    if (isStandardalone()) {
      setMessages(mockMsgs);
    }
  }, [text]);

  const sendMessage = useCallback(
    (newMessage: ChatMessage) => {
      let newMessageStack = [...messages, newMessage];
      setMessages(newMessageStack);
      sendToPlugin(PluginCommand.AppendToConversation, newMessage);
    },
    [messages],
  );

  const interruptChatStream = useCallback(() => {
    sendToPlugin(PluginCommand.InterruptChatStream, {});
  }, []);

  useEffect(() => {
    const handle = receiveFromPlugin(PluginCommand.RenderChatConversation, (messages) => setMessages([...messages]));
    return () => disposeHandler(handle);
  }, []);
  return { messages, sendMessage, interrupMessageStream: interruptChatStream };
}
