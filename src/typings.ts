declare global {
  interface Window {
    acquireVsCodeApi: () => any
    vscode: any
  }
}

export interface Message {
  content: string
  role: 'user' | 'assistant' | 'system'
  username: string
  avatar: string
  time: string
}