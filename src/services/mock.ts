import { Lang } from '../i18n';
import { ChatMessage, DevPilot } from '../typings';
import { createAssistantMessage, createDividerMessage, createUserMessage, createWelcomeMessage } from './messages';
export function mockMessages(text: Lang): ChatMessage[] {
  if (process.env.NODE_ENV === 'development') {
    const assistantAnswer = `
  ## Hello from React
  
  React is a JavaScript library for building user interfaces.
  
  single line of code \`console.log("Hello World")\`
  
  \`\`\`plain
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

  `;

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
          languageId: 'java',
          fileName: 'AIGatewayServiceProvider.java',
          fileUrl: 'a/b/AIGatewayServiceProvider.java',
          sourceCode: '',
          selectedStartLine: 1,
          selectedEndLine: 13,
          selectedEndColumn: 40,
          selectedStartColumn: 0,
          visible: true,
        },
        actions: ['copy', 'delete'],
      },
      createUserMessage('@repo this repo is used for what?'),
      createAssistantMessage(
        '<div class="rag-files"><div>src/repo/a/very/long/path/of/the/service/at/here/comp.tsx</div><div>src/service/b.tsx</div><div>src/service/c.tsx</div></div> This repo is used for ... I am not sure.',
      ),
      {
        ...createAssistantMessage('这是一个超级上下文的示例`console.log("Hello World")`'),
        recall: {
          steps: [{ status: 'done' }, { status: 'loading' }, { status: 'terminated' }],
          remoteRefs: [
            { languageId: 'ts', sourceCode: 'const a: string = This is a remoteRef', selectedStartLine: 2, selectedEndLine: 12 } as any,
          ],
          localRefs: [{ languageId: 'tsx', fileName: 'util.ts', sourceCode: '<div>This is a localRef</div>' } as any],
        },
      },
      createAssistantMessage('```tsx\nconst a = 1\nconst b = 2\nconst c = a + b\n```'),
      createAssistantMessage(
        '此代码是一个私有方法，名为`random`，用于在给定的上游服务器列表中根据权重随机选择一个上游服务器。该方法使用加权随机算法来确保选择的概率与每个上游服务器的权重成正比。\n\n### 1. 方法签名和参数\n\n```java\nprivate Upstream random(final int totalWeight, final int halfLengthTotalWeight, final int[] weights, final List<Upstream> upstreamList)\n```\n\n- `totalWeight`：所有上游服务器的总权重\n- `halfLengthTotalWeight`：前半部分权重的总和\n- `weights`：包含每个上游服务器权重的数组\n- `upstreamList`：上游服务器列表\n\n### 2. 初始随机值生成\n\n```java\nint offset = RANDOM.nextInt(totalWeight);\n```\n\n生成一个0到`totalWeight`之间的随机数，用于后续的权重选择。\n\n### 总结\n\n这段代码实现了一个高效的加权随机算法，用于在考虑权重的情况下从上游服务器列表中选择一个服务器。通过使用二分查找优化，该算法能够在处理大量服务器时保持良好的性能。该方法确保了选择的概率与每个服务器的权重成正比，从而实现了负载均衡的目的。',
      ),
      createAssistantMessage('...', true),
    ];
  }

  return [createWelcomeMessage(text, 'MockUser')];
}

export const mockedPlugin: Omit<DevPilot, 'handlers' | 'sendToPlugin' | 'receiveFromPlugin' | 'disposeHandler'> = {
  type: 'mocked',
  config: {
    theme: 'light',
    locale: 'en',
    username: 'MockUser',
    loggedIn: true,
    repo: {
      name: 'xpilot',
      embedding: true,
    },
  },
};
