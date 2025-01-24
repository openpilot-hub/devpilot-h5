const lang = {
  ragFileListTitle: 'Context',
  ragFileListTitleFileCount: '(%n files)',
  send: 'Send',
  stop: 'Stop',
  quoted: 'Quoted',
  contextCleared: 'Context cleared',
  login: 'Login',
  retryMsg: 'Retry',
  copyMsg: 'Copy to clipboard',
  likeMsg: 'Like',
  dislikeMsg: 'Dislike',
  chatWithContext: {
    label: 'context',
    title: 'chat with context',
  },
  chat: {
    label: 'chat',
    title: 'chat only',
  },
  errorMessage: {
    needLogin: "Hi, I'm DevPilot，your AI-Infused code copilot. Log in and start an AI journey!",
    exceedFilesLimit: 'The maximum number of references is 5!',
    exceedFilesLimitOfCmd: 'The maximum number of references for command is 1!',
  },
  codeblockActions: {
    insertAtCursor: 'Insert at cursor',
    replaceSelectedCode: 'Replace selected code',
    createFileWithCode: 'Create file with code',
    copyToClipboard: 'Copy to clipboard',
  },
  recall: {
    stepsTitle: 'Tinking',
    steps: ['Analyze', 'Retrieve', 'Generate'],
    stepsDesc: ['Analyze input content', 'Find related information', 'Summarize and produce an answer'],
    resultTitle: 'Search Result',
    resultDesc: 'Base on the following content',
  },
  inputPlaceholder: "Ask a question or type '/' for commands\nShift + Enter for new line",
  inputPlaceholder_mac: "Ask a question or type '/' for commands\n⇧ + ⏎ for new line",
  // shortcutHint: 'Shift + Enter for new line',
  clearChatHistory: 'clear chat history',
  useCommand: 'use commands',
  repoEmbedded: 'Repo embedding search available<br/>use <span class="xxx">@repo</span> to ask the whole repo',
  applyRepoEmbedding: 'This repo is not yet embbed, please apply for repo embbeding first',
  welcome: `Welcome **{{USER}}**! It's a pleasure to have you here. I am your trusty Assistant,ready to assist you in achieving your tasks more efficiently.

While you can certainly ask general questions, my true expertise lies in assisting you with your coding needs.
Here are a few examples of how I can be of assistance:


[1. Explain the meaning of the selected code.](#/explain)

[2. Fix the errors in the selected code.](#/fix)

[3. Generate comments for the selected code.](#/comment)


As an AI-powered assistant, I strive to provide the best possible assistance. However, please keep in mind that there might be occasional surprises or mistakes. It's always a good idea to double-check any generated code or suggestions.`,
};

export default lang;
