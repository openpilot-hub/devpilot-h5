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
import xml from 'react-syntax-highlighter/dist/cjs/languages/prism/xml-doc';
import styled from 'styled-components';
import './Markdown.css';

import { useMessage } from '@/contexts/message';
import { useI18n } from '@/i18n';
import { sendToPlugin } from '@/services/pluginBridge';
import { useSyntaxTheme } from '@/themes/themes';
import { Dropdown, MenuProps } from 'antd';
import React, { memo, useRef, useState } from 'react';
import { IRecall, PluginCommand } from '../typings';
import IconButton from './IconButton';
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
SyntaxHighlighter.registerLanguage('xml', xml);

function replaceLast(str: string, occurence: string, replacement: string) {
  if (!str) return '';
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

const getContent = (content: string, selectedText?: string | null) => {
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

function DivRender(params: any) {
  const { node, className, ...props } = params;
  const [opens, setOpens] = useState<boolean[]>([]);
  const { recall, id, role } = useMessage();
  const syntaxTheme = useSyntaxTheme();

  // if (className === 'rag-files' && params.children) {
  //   const repo = props['data-repo'];
  //   return (
  //     <RAGFileList
  //       files={params.children.map((child: any) => child.props.children?.[0])}
  //       clickAction={(file: string) => {
  //         sendToPlugin(PluginCommand.OpenFile, { repo, content: file, messageId: id, lang: 'text', role });
  //       }}
  //     />
  //   );
  // } else

  if (className === 'thinking-process') {
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
}

function CodeRender(params: any) {
  const { node, className, inline, ...props } = params;
  const { id, role } = useMessage();
  const hasLang = /language-(\w+)/.exec(className || '');
  const lang = hasLang ? hasLang[1] : '';
  const content = replaceLast(props.children?.[0], '\n', '');
  const { text } = useI18n();
  const syntaxTheme = useSyntaxTheme();
  const selectionRef = useRef('');

  const onCopyTriggerEnter = () => {
    selectionRef.current = getSelectedText();
  };

  const codeblockActions = (action: PluginCommand, content: string, lang: string, extra?: { [key: string]: string }): void => {
    sendToPlugin(action, { ...extra, content, messageId: id, lang, role });
  };

  const contextItems: MenuProps['items'] = [
    {
      label: <span onMouseEnter={onCopyTriggerEnter}>{text.codeblockActions.replaceSelectedCode}</span>,
      key: 'replaceSelectedCode',
      onClick() {
        codeblockActions(PluginCommand.ReplaceSelectedCode, getContent(content, selectionRef.current), lang);
      },
    },
    {
      label: <span onMouseEnter={onCopyTriggerEnter}>{text.codeblockActions.insertAtCursor}</span>,
      key: 'insertAtCursor',
      onClick() {
        codeblockActions(PluginCommand.InsertCodeAtCaret, getContent(content, selectionRef.current), lang);
      },
    },
  ];

  return !inline ? (
    <CodeEditor>
      <CodeEditorActionBar>
        <LanguageTag className="lang-tag">{lang || ''}</LanguageTag>
        <IconButton
          icon="cursor"
          type="fade"
          title={text.codeblockActions.insertAtCursor}
          onMouseEnter={onCopyTriggerEnter}
          onClick={() => codeblockActions(PluginCommand.InsertCodeAtCaret, getContent(content, selectionRef.current), lang)}
        />
        <IconButton
          icon="replace"
          type="fade"
          title={text.codeblockActions.replaceSelectedCode}
          onMouseEnter={onCopyTriggerEnter}
          onClick={() => codeblockActions(PluginCommand.ReplaceSelectedCode, getContent(content, selectionRef.current), lang)}
        />
        <IconButton
          icon="file"
          type="fade"
          title={text.codeblockActions.createFileWithCode}
          onMouseEnter={onCopyTriggerEnter}
          onClick={() => codeblockActions(PluginCommand.CreateNewFile, getContent(content, selectionRef.current), lang)}
        />
        <IconButton
          icon="copy"
          type="fade"
          title={text.codeblockActions.copyToClipboard}
          onMouseEnter={onCopyTriggerEnter}
          onClick={() => {
            let _content = getContent(content, selectionRef.current);
            navigator?.clipboard?.writeText(_content);
            codeblockActions(PluginCommand.CopyCode, _content, lang);
          }}
        />
      </CodeEditorActionBar>
      <Dropdown menu={{ items: contextItems }} trigger={['contextMenu']}>
        <div
          onContextMenu={(e) => {
            // hide the outer context menu.
            (e.target as HTMLDivElement).click();
            // stop the outer context menu from showing.
            e.stopPropagation();
          }}
        >
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
        </div>
      </Dropdown>
    </CodeEditor>
  ) : (
    <code className={className} {...props} />
  );
}

function ARender({ node, ...props }: any) {
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
}

export default { div: memo(DivRender), code: memo(CodeRender), a: memo(ARender) };
