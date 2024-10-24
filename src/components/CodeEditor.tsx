import { Item, Menu, useContextMenu } from 'react-contexify';
import { LuMinusSquare, LuPlusSquare } from 'react-icons/lu';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import less from 'react-syntax-highlighter/dist/cjs/languages/prism/less';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import stylus from 'react-syntax-highlighter/dist/cjs/languages/prism/stylus';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styled from 'styled-components';
import './Markdown.css';

import { useI18n } from '@/i18n';
import { sendToPlugin } from '@/services/pluginBridge';
import { useTheme } from '@/themes/themes';
import React, { useCallback, useRef, useState } from 'react';
import { ChatMessage, IRecall, PluginCommand } from '../typings';
import IconButton from './IconButton';
import RAGFileList from './RAGFileList';
import Thinking from './Thinking';

// SyntaxHighlighter.registerLanguage('javascriptreact', jsx) // 不生效
SyntaxHighlighter.registerLanguage('jsx', jsx);
// SyntaxHighlighter.registerLanguage('typescriptreact', tsx) // 不生效
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('less', less);
SyntaxHighlighter.registerLanguage('stylus', stylus);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('sql', sql);

function replaceLast(str: string, occurence: string, replacement: string) {
  return str.replace(new RegExp(`${occurence}$`), replacement);
}

// function skip<T extends object, K extends keyof T>(props: T, key: K): Omit<T, K> {
//   const { [key]: _, ...nextProps } = props;
//   return nextProps as Omit<T, K>;
// }

const CodeEditor = styled.div`
  border: ${(props) => props.theme.border};
  border-radius: 8px;
  margin: 1em 0;
  overflow: hidden;
`;
const CodeEditorActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1px;
  border-bottom: ${(props) => props.theme.border};
`;

const LanguageTag = styled.div`
  padding: 0 10px;
  font-size: 12px;
  font-weight: bold;
  flex-grow: 1;
  font-family: monospace;
  color: ${(props) => props.theme.text};
`;

const Lines = styled.span`
  padding-top: 2px;
  font-weight: normal;
  margin-right: 5px;
  line-height: 1;
  flex-shrink: 0;
  color: ${(props) => props.theme.textFaint};
`;

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

const linkActions = (href: string): boolean => {
  switch (href) {
    case '#/fix':
      sendToPlugin(PluginCommand.FixCode);
      return true;
    case '#/explain':
      sendToPlugin(PluginCommand.ExplainCode);
      return true;
    case '#/comment':
      sendToPlugin(PluginCommand.CommentCode);
      return true;
  }
  return false;
};

function Opener({ index, opens, onClick }: { index: number; opens: boolean[]; onClick: (e: boolean[]) => void }) {
  return (
    <div style={{ paddingLeft: 8, fontSize: 14, lineHeight: 0 }}>
      {opens[index] !== false ? (
        <LuMinusSquare
          onClick={() => {
            opens[index] = false;
            onClick([...opens]);
          }}
        />
      ) : (
        <LuPlusSquare
          onClick={() => {
            opens[index] = true;
            onClick([...opens]);
          }}
        />
      )}
    </div>
  );
}

const MarkdownComponents = ({ chatMessage }: { chatMessage: ChatMessage }) => {
  // TODO: use context to get current chatMessage
  const messageRef = useRef<ChatMessage>(chatMessage);
  const { text } = useI18n();
  const theme = useTheme();

  const syntaxTheme = theme === 'dark' ? oneDark : oneLight;

  messageRef.current = chatMessage;

  const div = useCallback((params: any) => {
    const { recall, id, role } = messageRef.current;
    const { node, className, ...props } = params;
    const [opens, setOpens] = useState<boolean[]>([]);

    if (className === 'rag-files' && params.children) {
      const repo = props['data-repo'];
      return (
        <RAGFileList
          files={params.children.map((child: any) => child.props.children?.[0])}
          clickAction={(file: string) => {
            sendToPlugin(PluginCommand.OpenFile, { repo, content: file, messageId: id, lang: 'text', role });
          }}
        />
      );
    } else if (className === 'thinking-process') {
      const refs = [...(recall!.localRefs || []), ...(recall!.remoteRefs || [])];
      return (
        <Thinking data={recall as IRecall} count={refs.length}>
          {refs.map((item, index) => {
            const open = opens[index] !== false;
            return (
              <CodeEditor key={index}>
                <CodeEditorActionBar style={{ borderBottom: open ? undefined : 0 }}>
                  <Opener index={index} opens={opens} onClick={setOpens} />
                  <LanguageTag>
                    {item.fileName ? (
                      <span
                        style={{ cursor: 'pointer' }}
                        title={item.fileUrl}
                        onClick={() => {
                          sendToPlugin(PluginCommand.GotoSelectedCode, item);
                        }}
                      >
                        {item.fileName}
                      </span>
                    ) : (
                      item.languageId || ''
                    )}
                  </LanguageTag>
                  {item.selectedEndLine && (
                    <Lines>
                      Lines {item.selectedStartLine + 1}-{item.selectedEndLine + 1}
                    </Lines>
                  )}
                </CodeEditorActionBar>
                {open && (
                  <SyntaxHighlighter
                    style={syntaxTheme}
                    language={item.languageId}
                    PreTag="div"
                    className="codeStyle"
                    showLineNumbers={true}
                    useInlineStyles={true}
                  >
                    {item.sourceCode!}
                  </SyntaxHighlighter>
                )}
              </CodeEditor>
            );
          })}
          {params.children}
        </Thinking>
      );
    } else {
      return React.createElement('div', props, params.children);
    }
  }, []);

  const code = useCallback(({ node, className, inline, ...props }: any) => {
    const { codeRef, id, role } = messageRef.current;
    const hasLang = /language-(\w+)/.exec(className || '');
    const lang = hasLang ? hasLang[1] : '';
    const content = replaceLast(props.children[0], '\n', '');
    const { show, hideAll } = useContextMenu({ id: 'CODEBLOCK_CONTEXT_MENU' });

    function handleContextMenu(event: any) {
      event.stopPropagation();
      show({ event, props: { key: 'value' } });
    }

    const codeblockActions = (action: PluginCommand, content: string, lang: string, extra?: { [key: string]: string }): void => {
      sendToPlugin(action, { ...extra, content, messageId: id, lang, role });
    };

    return !inline ? (
      <CodeEditor onContextMenu={handleContextMenu}>
        <CodeEditorActionBar>
          <LanguageTag className="lang-tag">
            {codeRef ? (
              <span
                style={{ cursor: 'pointer' }}
                // data-tooltip-id="tooltip"
                // data-tooltip-content={codeRef.fileUrl + codeRef.fileUrl}
                title={codeRef.fileUrl}
                onClick={() => {
                  sendToPlugin(PluginCommand.GotoSelectedCode, codeRef);
                }}
              >
                {codeRef.fileName}
              </span>
            ) : (
              lang || ''
            )}
          </LanguageTag>
          <IconButton
            icon="cursor"
            type="fade"
            title={text.codeblockActions.insertAtCursor}
            onClick={() => codeblockActions(PluginCommand.InsertCodeAtCaret, getContent(content), lang)}
          />
          <IconButton
            icon="replace"
            type="fade"
            title={text.codeblockActions.replaceSelectedCode}
            onClick={() => codeblockActions(PluginCommand.ReplaceSelectedCode, getContent(content), lang)}
          />
          <IconButton
            icon="file"
            type="fade"
            title={text.codeblockActions.createFileWithCode}
            onClick={() => codeblockActions(PluginCommand.CreateNewFile, getContent(content), lang)}
          />
          <IconButton
            icon="copy"
            type="fade"
            title={text.codeblockActions.copyToClipboard}
            onClick={() => {
              let _content = getContent(content);
              navigator?.clipboard?.writeText(_content);
              codeblockActions(PluginCommand.CopyCode, _content, lang);
            }}
          />
        </CodeEditorActionBar>
        <SyntaxHighlighter
          style={syntaxTheme}
          language={lang}
          PreTag="div"
          className="codeStyle"
          showLineNumbers={true}
          useInlineStyles={true}
          // wrapLines={hasMeta}
          // lineProps={applyHighlights}
        >
          {content}
        </SyntaxHighlighter>
        <Menu id={'CODEBLOCK_CONTEXT_MENU'} theme={theme} animation={false}>
          <Item
            id="text.codeblockActions.replaceSelectedCode"
            onClick={() => {
              codeblockActions(PluginCommand.ReplaceSelectedCode, getContent(content), lang);
              hideAll();
            }}
          >
            {text.codeblockActions.replaceSelectedCode}
          </Item>
          <Item
            id="text.codeblockActions.insertAtCursor"
            onClick={() => {
              codeblockActions(PluginCommand.InsertCodeAtCaret, getContent(content), lang);
              hideAll();
            }}
          >
            {text.codeblockActions.insertAtCursor}
          </Item>
        </Menu>
      </CodeEditor>
    ) : (
      <code className={className} {...props} />
    );
  }, []);

  const comp = {
    // codeblockActions(action: PluginCommand, content: string, lang: string, extra?: { [key: string]: string }): void {
    //   throw new Error('Method not implemented.');
    // },
    // linkActions(href: string): boolean {
    //   throw new Error('Method not implemented.');
    // },
    a({ node, ...props }: any) {
      return (
        <a
          {...props}
          onClick={(event) => {
            const preventDefault = linkActions(node.properties.href);
            if (preventDefault) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        />
      );
    },
    div,
    code,
  };

  // comp.code = comp.code.bind(comp);
  // comp.div = comp.div.bind(comp);
  // comp.a = comp.a.bind(comp);

  return comp;
};

export type MarkdownComponents = ReturnType<typeof MarkdownComponents>;

export const CodeEditorGen = MarkdownComponents;
