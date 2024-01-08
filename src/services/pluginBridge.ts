import { PluginMessage } from "../typings"

function getPlugin() {
  if (window.devpilot) {
    return window.devpilot
  }

  if (window.acquireVsCodeApi) {
    const vscode = window.acquireVsCodeApi()
    window.devpilot = {
      type: 'vscode',
      callbacks: [],
      receiveFromPlugin: (callback: (message: PluginMessage) => void) => {
        return window.addEventListener('message', (event) => {
          callback(event.data)
        })
      },
      sendToPlugin: (message: PluginMessage) => {
        vscode.postMessage(message)
      },
      disposeHandler: (handler: (message: PluginMessage) => void) => {
        window.removeEventListener('message', handler as any)
      }
    }
    return window.devpilot
  }
  
  if (window.sendToIntelliJ) {
    window.receiveFromIntelliJ = function(message: PluginMessage) {
      window.devpilot.callbacks.forEach((callback: (message: PluginMessage) => void) => {
        callback(message)
      })
    },
    window.devpilot = {
      type: 'intellij',
      callbacks: [],
      receiveFromPlugin(callback) {
        this.callbacks.push(callback);
      },
      sendToPlugin(message: PluginMessage) {
        window.sendToIntelliJ(message)
      },
      disposeHandler(handler: (message: PluginMessage) => void) {
        this.callbacks = this.callbacks.filter((callback: (message: PluginMessage) => void) => {
          return callback !== handler
        })
      }
    }
    return window.devpilot
  }

  window.devpilot = {
    type: 'mocked',
    callbacks: [],
    receiveFromPlugin: (callback: (message: PluginMessage) => void) => {
      console.log('Message from plugin:', callback)
    },
    sendToPlugin: (message: PluginMessage) => {
      console.log('Message to plugin:', message)
    },
    disposeHandler: (handler: (message: PluginMessage) => void) => {
      console.log('Handler disposed:', handler)
    }
  }

  return window.devpilot
}

export function isStandardalone() {
  return getPlugin().type === 'mocked'
}

export function sendToPlugin(command: string, payload: any) {
  return getPlugin().sendToPlugin({ command, payload })
}

export function receiveFromPlugin(command: string, callback: (message: any) => void) {
  return getPlugin().receiveFromPlugin((message: PluginMessage) => {
    if (message.command === command) {
      callback(message.payload)
    }
  })
}

export function disposeHandler(handler: any) {
  if (!handler) return
  if (window.devpilot) {
    window.devpilot.disposeHandler(handler)
  }
}

export async function readThemeFromPlugin() {
  return new Promise<'light'|'dark'>((resolve) => {
    resolve(!!document.body.classList.contains('vscode-light') ? 'light' : 'dark')
  })
}