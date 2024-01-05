
function getVsCode() {
  if (window.vscode) {
    return window.vscode
  }
  if (window.acquireVsCodeApi) {
    window.vscode = window.acquireVsCodeApi()
    return window.vscode
  } else {
    window.vscode = {
      mocked: true,
      postMessage: (message: any) => {
        console.log('Message to plugin:', message)
      },
    }
  }
  return window.vscode
}

export function isStandardalone() {
  return getVsCode().mocked
}

export function sendToPlugin(command: string, payload: any) {
  const vscode = getVsCode()
  return vscode.postMessage({ command, payload })
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

export async function readThemeFromPlugin() {
  return new Promise<'light'|'dark'>((resolve) => {
    resolve(!!document.body.classList.contains('vscode-light') ? 'light' : 'dark')
  })
}