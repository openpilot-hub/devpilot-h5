import { Lang } from "../i18n"
import { ChatMessage, DevPilot } from "../typings"
import { createAssistantMessage, createDividerMessage, createUserMessage, createWelcomeMessage } from "./messages"
export function mockMessages(text: Lang): ChatMessage[] {
  
  const assistantAnswer = `
  ## Hello from React
  
  React is a JavaScript library for building user interfaces.
  
  single line of code \`console.log("Hello World")\`
  
  \`\`\`
  some plain text
  some plain text
  some plain text
  some plain text
  some plain text
  some plain text
  \`\`\`
  
  \`\`\`tsx {5-9}
  import React from'react'
  import { useState } from 'react'
  import './App.css'
  
  function App() {
    const [count, setCount] = useState(0);
    return (
      <div>
      </div>
    )
  }
  export default App
  \`\`\`

  这段代码是用 TypeScript 编写的，用于创建一个名为 theme 的状态变量和一个名为 setTheme 的状态更新函数。它使用了 React 的 useState 钩子，其中 <'light'|'dark'> 表示 theme 的初始值只能是 'light' 或 'dark' 两者之一。

  \`\`\`tsx
  const [theme, setTheme] = useState<'light'|'dark'>
  \`\`\`

  这段代码是用 TypeScript 编写的，用于创建一个名为 theme 的状态变量和一个名为 setTheme 的状态更新函数。它使用了 React 的 useState 钩子，其中 <'light'|'dark'> 表示 theme 的初始值只能是 'light' 或 'dark' 两者之一。

  `

  return [
    createWelcomeMessage(text, 'MockUser'),
    createUserMessage('tell me about react'),
    createAssistantMessage(assistantAnswer),
    createDividerMessage(),
    createUserMessage('show me some code'),
    {
      id: Math.random().toString(36).substring(7),
      status: 'ok',
      content: 'Test',
      role: 'user',
      username: '',
      avatar: '',
      time: Date.now(),
      streaming: false,
      codeRef: {
        fileName: 'AIGatewayServiceProvider.java',
        fileUrl: 'a/b/AIGatewayServiceProvider.java',
        selectedStartLine: 1,
        selectedEndLine: 13,
      },
      actions: ['copy', 'delete']
    },
    createUserMessage('@repo this repo is used for what?'),
    createAssistantMessage('<div class="rag-files"><div>src/repo/a/very/long/path/of/the/service/at/here/comp.tsx</div><div>src/service/b.tsx</div><div>src/service/c.tsx</div></div> This repo is used for ... I am not sure.'),
    createAssistantMessage('```tsx\nconst a = 1\nconst b = 2\nconst c = a + b\n```'),
    createAssistantMessage('...', true),
  ]
}

export const mockedPlugin: Omit<DevPilot, 'handlers' | 'sendToPlugin' |'receiveFromPlugin' | 'disposeHandler'> = {
  type: 'mocked',
  config: {
    theme: 'light',
    locale: 'en',
    username: 'MockUser',
    loggedIn: true,
    repo: {
      name: 'xpilot',
      embedding: true
    }
  }
}