export function sendToPlugin(command: string, payload: any) {
  if (window.acquireVsCodeApi) {
    const vscode = window.acquireVsCodeApi()
    return vscode?.postMessage({ command, payload })
  } else {
    alert('Not running in VS Code!')
    if (command === 'AppendToConversation') {
      receiveFromPlugin('RenderChatConversation', payload)
    }
  }
}

export function receiveFromPlugin(command: string, callback: (message: any) => void) {
  const handler = window.addEventListener('message', (event) => {
    if (event.data.command === command) {
      callback(event.data.payload);
    }
  })
  return handler
}

export function disposeHandler(handler: any) {
  window.removeEventListener('message', handler)
}

