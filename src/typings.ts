export interface PluginMessage {
  command: string
  payload: any
}

export interface Message {
  content: string
  role: 'user' | 'assistant' | 'system'
  username: string
  avatar: string
  time: number
  streaming: boolean
}

type DevPilot = {
  type: 'vscode' | 'intellij' | 'mocked'
  callbacks: Array<(message: PluginMessage) => void>
  receiveFromPlugin: (callback: (message: PluginMessage) => void) => void
  sendToPlugin: (message: PluginMessage) => void
  disposeHandler: (handler: (message: PluginMessage) => void) => void
}

declare global {
  interface Window {
    devpilot: DevPilot
    acquireVsCodeApi: () => any
    receiveFromIntelliJ: (message: PluginMessage) => void
    sendToIntelliJ: (message: string) => void
  }
}