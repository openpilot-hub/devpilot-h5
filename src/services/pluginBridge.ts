
function getVsCode() {
  if (window.vscode) {
    return window.vscode
  }
  if (window.acquireVsCodeApi) {
    window.vscode = window.acquireVsCodeApi()
    return window.vscode
  } else {
    alert('Not running in VS Code!')
    return null
  }
}

export function sendToPlugin(command: string, payload: any) {
  const vscode = getVsCode();
  return vscode?.postMessage({ command, payload })
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

