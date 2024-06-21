import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit'
import {CodeEditorGen, MarkdownComponents} from './CodeEditor'

function rehypeInlineCodeProperty() {
  return function (tree: any) {
    visit(tree, (node: any) => node.tagName === 'code', function (node, index, parent) {
      if (parent && parent.tagName === 'pre') {
        node.properties.inline = 'false'
      } else {
        node.properties.inline = 'true'
      }
    })
  }
}

type MarkdownProps = {
  markdown: string,
  codeblockActions: MarkdownComponents['codeblockActions'],
  linkActions: MarkdownComponents['linkActions'],
}

export default function Markdown({ markdown, codeblockActions, linkActions }: MarkdownProps) {
  const codeEditor = CodeEditorGen()
  codeEditor.codeblockActions = codeblockActions.bind(codeEditor)
  codeEditor.linkActions = linkActions.bind(codeEditor)
  return (
    <ReactMarkdown
      className='markdown-renderer'
      children={markdown}
      components={codeEditor}
      rehypePlugins={[
        rehypeRaw,
        rehypeInlineCodeProperty
      ]}
    />
  )
}
