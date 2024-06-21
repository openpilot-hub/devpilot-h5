import styled from 'styled-components'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import rangeParser from 'parse-numeric-range'
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
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import './Markdown.css'

import IconButton from './IconButton'
import { useTheme } from '../themes/themes';
import { PluginCommand } from '../typings';
import { useI18n } from '@/i18n';
import React from 'react';
import RAGFileList from './RAGFileList';

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

function replaceLast(str: string, occurence: string, replacement: string) {
  return str.replace(new RegExp(`${occurence}$`), replacement)
}

function skip<T extends object, K extends keyof T>(props: T, key: K): Omit<T, K> {
  const { [key]: _, ...nextProps } = props;
  return nextProps as Omit<T, K>;
}

const CodeEditor = styled.div`
  border: ${props => props.theme.border};
  border-radius: 8px;
  margin: 1em 0;
  overflow: hidden;
  .codeStyle {
    padding-bottom: 0px !important;
  }
`
const CodeEditorActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1px;
  border-bottom: ${props => props.theme.border};
`

const LanguageTag = styled.div`
  padding: 0 10px;
  font-size: 12px;
  font-weight: bold;
  flex-grow: 1;
  font-family: monospace;
  color: ${props => props.theme.text};
`

const getSelectedText = () => {
  const selection = document.getSelection();
  if (selection) {
    const text = selection.toString();
    return text
      .split(/\n/)
      .map((item) => item.replace(/^\d+/, ''))
      .join('\n');
  }
  return '';
};

const getContent = (content: string) => {
  const selectedText = getSelectedText();
  if (selectedText && content.includes(selectedText)) {
    return selectedText;
  }
  return content;
};

const MarkdownComponents = () => {
  const comp = {
    codeblockActions(action: PluginCommand, content: string, lang: string, extra?: { [key: string]: string }): void {
      throw new Error('Method not implemented.')
    },
    linkActions(href: string): boolean {
      throw new Error('Method not implemented.')
    },
    a({ node, ...props }: any) {
      return <a {...props} onClick={(event) => {
        const preventDefault = this.linkActions(node.properties.href)
        if (preventDefault) {
          event.preventDefault()
          event.stopPropagation()
        }
      }} />
    },
    div(params: any) {
      const { node, className, ...props } = params;
      if (className === 'rag-files') {
        const repo = props['data-repo'];
        return (
          <RAGFileList
            files={params.children.map((child: any) => child.props.children[0])}
            clickAction={(file: string) => {
              this.codeblockActions(PluginCommand.OpenFile, file, 'text', { repo });
            }}
          />
        )
      } else {
        return React.createElement('div', props, params.children);
      }
    },
    code({ node, className, ...props }: any) {
      const hasLang = /language-(\w+)/.exec(className || '')
      const lang = hasLang ? hasLang[1] : ''
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
      }

      const theme = useTheme();
      const { text } = useI18n();
      const syntaxTheme = theme === 'dark' ? oneDark : oneLight;
      const content = replaceLast(props.children[0], '\n', '');

      return !inline ? (
        <CodeEditor>
          <CodeEditorActionBar>
            {lang && <LanguageTag>{lang}</LanguageTag>}
            <IconButton icon='cursor' type='fade' title={text.codeblockActions.insertAtCursor}
              onClick={() => this.codeblockActions(PluginCommand.InsertCodeAtCaret, getContent(content), lang)}
            />
            <IconButton icon='replace' type='fade' title={text.codeblockActions.replaceSelectedCode}
              onClick={() => this.codeblockActions(PluginCommand.ReplaceSelectedCode, getContent(content), lang)}
            />
            <IconButton icon='file' type='fade' title={text.codeblockActions.createFileWithCode}
              onClick={() => this.codeblockActions(PluginCommand.CreateNewFile, getContent(content), lang)}
            />
            <IconButton icon='copy' type='fade' title={text.codeblockActions.copyToClipboard}
              onClick={() => {
                let _content = getContent(content);
                navigator?.clipboard?.writeText(_content);
                this.codeblockActions(PluginCommand.CopyCode, _content, lang);
              }}
            />
          </CodeEditorActionBar>
          <SyntaxHighlighter
            style={syntaxTheme}
            language={lang}
            PreTag="div"
            className="codeStyle"
            showLineNumbers={true}
            wrapLines={hasMeta}
            useInlineStyles={true}
            lineProps={applyHighlights}
          >
            {content}
          </SyntaxHighlighter>
        </CodeEditor>
      ) : (
        <code className={className} {...skip(props, 'inline')} />
      )
    }
  }

  comp.code = comp.code.bind(comp)
  comp.div = comp.div.bind(comp)
  comp.a = comp.a.bind(comp)

  return comp
}

export type MarkdownComponents = ReturnType<typeof MarkdownComponents>;

export const CodeEditorGen = MarkdownComponents;
