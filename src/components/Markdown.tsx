import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import rangeParser from 'parse-numeric-range';
import {visit} from 'unist-util-visit'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java'
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import './Markdown.css'

SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('scss', scss)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('python', python)

const syntaxTheme = oneDark

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

const MarkdownComponents = {
  code({ node, className, ...props }: any) {
    const hasLang = /language-(\w+)/.exec(className || '')
    const hasMeta = node?.data?.meta
    const inline = node.properties.inline === 'true'

    const applyHighlights: object = (applyHighlights: number) => {
      if (hasMeta) {
        const RE = /{([\d,-]+)}/;
        const metadata = node.data.meta?.replace(/\s/g, '')
        const strlineNumbers = RE.test(metadata)
          ? RE.exec(metadata)![1]
          : '0'
        const highlightLines = rangeParser(strlineNumbers)
        const highlight = highlightLines
        const data = highlight.includes(applyHighlights)
          ? 'highlight'
          : null
        return { data }
      } else {
        return {}
      }
    };

    return !inline ? (
      <SyntaxHighlighter
        style={syntaxTheme}
        language={hasLang ? hasLang[1] : ''}
        PreTag="div"
        className="codeStyle"
        showLineNumbers={true}
        wrapLines={hasMeta}
        useInlineStyles={true}
        lineProps={applyHighlights}
      >
        {props.children}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props} />
    )
  }
}

export default function Markdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      className='markdown-renderer'
      children={markdown}
      components={MarkdownComponents}
      rehypePlugins={[rehypeInlineCodeProperty]}
    />
  )
}