import { useEffect, useState } from "react"
import { DevPilot, PluginCommand, PluginConfiguration, PluginMessage, PluginMessageCallback, PluginMessageHandler } from "../typings"
import { mockedPlugin } from './mock';

function getPlugin() {

  if (window.devpilot) {
    if (window.devpilot.type !== 'mocked') {
      return window.devpilot
    }
    if (window.devpilot.type === 'mocked' && !(window.acquireVsCodeApi || window.sendToIntelliJ)) {
      return window.devpilot
    }
  }

  const devpilotBasicMixin: Pick<DevPilot, 'handlers' | 'receiveFromPlugin' | 'disposeHandler'> = {
    handlers: [],
    receiveFromPlugin(command: PluginCommand, callback: PluginMessageCallback) {
      const handler = (message: PluginMessage) => {
        if (message.command === command) {
          callback(message.payload)
        }
      }
      this.handlers.push(handler)
      return handler
    },
    disposeHandler(handler: PluginMessageHandler) {
      this.handlers = this.handlers.filter((callback: PluginMessageHandler) => callback !== handler)
    }
  }

  // vscode version
  if (window.acquireVsCodeApi) {
    const vscode = window.acquireVsCodeApi()
    window.devpilot = {
      ...devpilotBasicMixin,
      type: 'vscode',
      config: {
        theme: !!document.body.classList.contains('vscode-light') ? 'light' : 'dark',
        locale: 'en',
        username: 'User',
        loggedIn: true,
        repo: {
          name: 'repo',
          embedding: false
        }
      },
      sendToPlugin(message: PluginMessage) {
        vscode.postMessage(message)
      },
    }
    window.addEventListener('message', (event) => {
      window.devpilot.handlers.forEach(callback => callback(event.data))
    })
    return window.devpilot
  }

  // intelliJ version
  if (window.sendToIntelliJ) {
    window.receiveFromIntelliJ = function (message: PluginMessage) {
      window.devpilot.handlers.forEach((callback: PluginMessageHandler) => {
        callback(message)
      })
    };
    window.devpilot = {
      ...devpilotBasicMixin,
      type: 'intellij',
      config: {
        theme: window.intellijConfig?.theme ?? 'light',
        locale: window.intellijConfig?.locale ?? 'en',
        username: window.intellijConfig?.username ?? 'User',
        loggedIn: window.intellijConfig?.loggedIn ?? false,
        repo: {
          name: '',
          embedding: false
        }
      },
      sendToPlugin(message: PluginMessage) {
        window.sendToIntelliJ(JSON.stringify(message))
      },
    }
    return window.devpilot
  }

  // web version
  window.devpilot = {
    ...devpilotBasicMixin,
    ...mockedPlugin,
    handlers: [],
    sendToPlugin(message: PluginMessage) {
      console.log('Message to plugin:', message)
    }
  }

  return window.devpilot
}

export function isStandardalone() {
  return getPlugin().type === 'mocked'
}

export function sendToPlugin(command: PluginCommand, payload: any = {}) {
  return getPlugin().sendToPlugin({ command, payload })
}

export function receiveFromPlugin(command: PluginCommand, callback: PluginMessageCallback) {
  return getPlugin().receiveFromPlugin(command, callback)
}

export function disposeHandler(handler: PluginMessageHandler) {
  if (!handler)
    return
  if (window.devpilot) {
    window.devpilot.disposeHandler(handler)
  }
}

export function getPluginState(key: keyof PluginConfiguration): PluginConfiguration[keyof PluginConfiguration] {
  return getPlugin().config[key]
}

export function usePluginState<K extends keyof PluginConfiguration>(key: K): PluginConfiguration[K] {
  const [state, setState] = useState(getPlugin().config[key])
  useEffect(() => {
    let handle: PluginMessageHandler
    if (key === 'theme') {
      handle = getPlugin().receiveFromPlugin(PluginCommand.ThemeChanged, payload => {
        getPlugin().config.theme = payload.theme
        setState(payload.theme)
      })
    } else if (key === 'locale') {
      handle = getPlugin().receiveFromPlugin(PluginCommand.LocaleChanged, payload => {
        getPlugin().config.locale = payload.locale
        setState(payload.locale)
      })
    } else if (key === 'repo') {
      handle = getPlugin().receiveFromPlugin(PluginCommand.PresentCodeEmbeddedState, payload => {
        getPlugin().config.repo = {
          name: payload.repoName,
          embedding: payload.repoEmbedded
        }
        setState({
          name: payload.repoName,
          embedding: payload.repoEmbedded
        } as any)
      })
    }

    let handle2 = getPlugin().receiveFromPlugin(PluginCommand.ConfigurationChanged, payload => {
      if (payload[key] !== undefined) {
        getPlugin().config[key] = payload[key] as never
        setState(payload[key])
      }
    })

    return () => {
      disposeHandler(handle)
      disposeHandler(handle2)
    }
  }, [])

  return state
}