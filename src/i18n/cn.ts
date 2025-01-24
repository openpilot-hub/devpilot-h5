import { type I18nLang } from '.';

const lang: I18nLang = {
  ragFileListTitle: '上下文',
  ragFileListTitleFileCount: '(%n 个文件)',
  send: '发送',
  stop: '停止',
  quoted: '引用',
  contextCleared: '上下文已清除',
  login: '登录',
  retryMsg: '重新生成',
  copyMsg: '复制到剪贴板',
  likeMsg: '赞',
  dislikeMsg: '踩',
  chatWithContext: {
    label: '上下文',
    title: '带上下文的对话',
  },
  chat: {
    label: '对话',
    title: '仅对话',
  },
  errorMessage: {
    needLogin: '您好，我是DevPilot，您的AI代码助理。登录并开始AI之旅吧！',
    exceedFilesLimit: '最多引用5处！',
    exceedFilesLimitOfCmd: '命令中最多引用1处！',
  },
  codeblockActions: {
    insertAtCursor: '在光标处插入',
    replaceSelectedCode: '替换所选代码',
    createFileWithCode: '使用代码创建文件',
    copyToClipboard: '复制到剪贴板',
  },
  recall: {
    stepsTitle: '思考过程',
    steps: ['分析', '检索', '生成'],
    stepsDesc: ['分析输入内容', '查找关联信息', '汇总生成答案'],
    resultTitle: '搜索结果',
    resultDesc: '基于以下内容整理回答',
  },
  inputPlaceholder: "提问或输入 '/' 查看命令\nShift + Enter 换行",
  inputPlaceholder_mac: "提问或输入 '/' 查看命令\n⇧ + ⏎ 换行",
  // shortcutHint: 'Shift + Enter 换行',
  clearChatHistory: '清除对话历史',
  useCommand: '使用命令',
  repoEmbedded: '可使用仓库向量增强检索, 使用@repo对整个仓库进行提问',
  applyRepoEmbedding: '该仓库还未向量化，请先申请仓库向量化',
  welcome: `欢迎您 {{USER}}! 很高兴您的使用， 我是您值得信赖的助理，随时准备帮助您更有效地完成任务。
  
您可以提出一般性问题，但我真正的专业知识在于帮助您满足编码需求，以下是我如何提供帮助的几个例子：

[1. 解释所选代码含义](#/explain)

[2. 修复所选代码错误](#/fix)

[3. 生成所选代码注释](#/comment)

作为一名人工智能助手，我努力提供最好的帮助，但是请记住，偶尔可能会出现意外或错误，仔细检查任何生成的代码或建议总是一个好主意。`,
};

export default lang;
