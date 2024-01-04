declare global {
  interface Window {
    acquireVsCodeApi: () => any
  }
}

export interface Message {
  content: string
  role: 'user' | 'assistant' | 'system'
  username: string
  avatar: string
  time: string
}