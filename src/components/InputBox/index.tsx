import { disposeHandler, receiveFromPlugin, sendToPlugin } from '@/services/pluginBridge';
import { encodeUserContent, isMac } from '@/utils';
import { Divider, Input } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { useEffect, useRef, useState } from 'react';
import { MdKeyboardCommandKey } from 'react-icons/md';
import styled, { useTheme } from 'styled-components';
import { useI18n } from '../../i18n';
import { ChatMessage, CodeReference, PluginCommand, QuickCommand } from '../../typings';
import FileReference from '../FileReference';
import { IconClear, IconEnter } from '../Svgs';

import './index.less';

const CommandBox = styled.div`
  position: absolute;
  bottom: 50px;
  left: 9px;
  padding: 4px 4px 0;
  min-width: 120px;
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.colorBgElevated};
  border-radius: 4px;
  box-shadow: 0px 4px 24px 0px rgba(24, 27, 37, 0.12);
  overflow: hidden;
  font-size: 12px;
`;

const CommandItem = styled.div<{ $highlight: boolean }>`
  background-color: ${(props) => (props.$highlight ? props.theme.itemActiveBg : 'transparent')};
  cursor: pointer;
  padding: 0 16px;
  font-family: monospace, consolas, courier-new, sans-serif;
  border-radius: 4px;
  line-height: 28px;
  margin-bottom: 4px;
  &:hover {
    background-color: ${(props) => props.theme.itemActiveBg};
  }
`;

interface InputBoxProps {
  onSend: (command: PluginCommand | undefined, data?: Partial<ChatMessage>) => void;
  quickCommands: string[];
  children?: React.ReactNode;
  disabled?: boolean;
}

const quickCommandMapping: Record<QuickCommand, PluginCommand> = {
  [QuickCommand.Clear]: PluginCommand.ClearChatHistory,
  [QuickCommand.Fix]: PluginCommand.FixCode,
  [QuickCommand.Explain]: PluginCommand.ExplainCode,
  [QuickCommand.Comment]: PluginCommand.CommentCode,
  [QuickCommand.Test]: PluginCommand.TestCode,
  // [QuickCommand.Performance]: PluginCommand.CheckCodePerformance,
};

const processUserInput = (value: string) => {
  if (value && (value = value.trim()) && value.startsWith('/')) {
    const firstSpaceIndex = value.indexOf(' ');
    let command = value as QuickCommand;
    let content = '';
    if (firstSpaceIndex > 0) {
      command = value.substring(0, firstSpaceIndex) as QuickCommand;
      content = value.substring(firstSpaceIndex).trim();
    }
    if (quickCommandMapping[command]) {
      return {
        command: quickCommandMapping[command],
        content: encodeUserContent(content),
      };
    }
  }
  return { content: encodeUserContent(value).trim() };
};

export default function InputBox({ onSend, quickCommands, children, disabled }: InputBoxProps) {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [prevValues, setPrevValues] = useState<string[]>([]);
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const { text } = useI18n();
  const textareaRef = useRef<TextAreaRef>(null);
  const [codeRefs, setCodeRefs] = useState<CodeReference[]>([]);
  const [commandBoxVisible, setCommandBoxVisible] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(quickCommands);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const [isInMac] = useState(isMac);
  const codeRefsRef = useRef(codeRefs);

  codeRefsRef.current = codeRefs;

  const cursorClass = disabled ? 'not-allowed' : 'pointer';

  // const onRepoLabelClick = () => {
  //   if (textareaRef.current) {
  //     textareaRef.current.focus();
  //     textareaRef.current.value = '@repo ';
  //   }
  // };

  useEffect(() => {
    const newFilteredCommands = quickCommands.filter((cmd) => cmd.startsWith(value));
    setFilteredCommands(newFilteredCommands);
    if (value === '/') {
      setCommandBoxVisible(true);
    } else if (!value) {
      setCommandBoxVisible(false);
    }
  }, [value]);

  useEffect(() => {
    const handle = receiveFromPlugin(PluginCommand.ReferenceCode, (payload: CodeReference) => {
      if (codeRefsRef.current.length >= 5) {
        sendToPlugin(PluginCommand.ShowMessage, { type: 'info', content: text.errorMessage.exceedFilesLimit });
        return;
      }
      if (!codeRefsRef.current.find((item) => item.sourceCode.includes(payload.sourceCode))) {
        setCodeRefs([...codeRefsRef.current.filter((item) => !payload.sourceCode.includes(item.sourceCode)), payload]);
      }
    });
    return () => disposeHandler(handle);
  }, []);

  const handleClearHistory = () => {
    if (!disabled) {
      onSend(PluginCommand.ClearChatHistory);
    }
  };

  const clearCodeRef = (targetIndex?: number) => {
    if (targetIndex === undefined) {
      setCodeRefs([]);
    } else {
      setCodeRefs(codeRefs.filter((_, index) => targetIndex !== index));
    }
  };

  const handleSendMessage = (ctrlKey?: boolean) => {
    if (value.trim() && !disabled) {
      const { command, content } = processUserInput(value);
      if (command && codeRefs.length > 1) {
        sendToPlugin(PluginCommand.ShowMessage, {
          type: 'info',
          content: text.errorMessage.exceedFilesLimitOfCmd,
        });
      } else {
        const newPrevValues = [...prevValues, value.trim()];
        setPrevValues(newPrevValues);
        setPrevIndex(newPrevValues.length);
        setValue('');
        onSend(command, {
          content,
          codeRefs: codeRefs.sort((prev, next) => (prev.order || 0) - (next.order || 0)),
          mode: ctrlKey ? 'with-ctrl' : undefined,
        });
        clearCodeRef();
      }
    }
  };

  const handleSelectCommand = (command: string) => {
    setValue(command);
    setSelectedCommandIndex(0);
    setCommandBoxVisible(false);
    textareaRef.current?.focus();
  };

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    const tf: any = textareaRef.current;
    if (!tf) return;
    if (e.key === 'Enter' && (e.isComposing || e.keyCode === 229)) {
      return;
    }
    if (e.key === 'Enter') {
      if (commandBoxVisible && filteredCommands.length) {
        const command = filteredCommands[selectedCommandIndex];
        if (command) {
          handleSelectCommand(command);
          e.preventDefault();
        }
      } else if (!e.shiftKey) {
        e.preventDefault();
        handleSendMessage(isInMac ? e.metaKey : e.ctrlKey);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const tf: any = textareaRef.current;
    if (!tf) return;

    // tf.caret0 = tf.selectionStart === 0;

    if (e.key === 'Escape') {
      commandBoxVisible && setCommandBoxVisible(false);
      return;
    }

    const multilines = (!!value && value.split('\n').length > 1) || false;

    if (e.key === 'ArrowUp') {
      if (commandBoxVisible) {
        setSelectedCommandIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : filteredCommands.length - 1));
        // Prevent cursor from moving in input field
        e.preventDefault();
      } else if (!multilines) {
        let index = prevIndex - 1;
        if (index >= 0 && index < prevValues.length) {
          setPrevIndex(index);
          setValue(prevValues[index]);
          e.preventDefault();
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (commandBoxVisible) {
        setSelectedCommandIndex((prevIndex) => (prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : 0));
        // Prevent cursor from moving in input field
        e.preventDefault();
      } else if (!multilines) {
        let index = prevIndex + 1;
        if (index < prevValues.length) {
          setPrevIndex(index);
          setValue(prevValues[index]);
        }
      }
    }
  };

  return (
    <div className="input-container">
      {codeRefs.length > 0 && <FileReference codeRefs={codeRefs} onRemove={clearCodeRef} onChange={setCodeRefs} />}
      <div className="input-box flex">
        <Input.TextArea
          ref={textareaRef}
          disabled={disabled}
          value={value}
          className="hide-scrollbar"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={() => {
            timerRef.current = setTimeout(() => {
              setCommandBoxVisible(false);
            }, 200);
          }}
          onChange={handleChange}
          autoFocus
          placeholder={isInMac ? text.inputPlaceholder_mac : text.inputPlaceholder}
          autoSize={{ minRows: 1, maxRows: 10 }}
        />
        <div className="shortcuts-box" style={{ color: theme.textFaint }}>
          <div className="shortcuts">
            <span
              style={{ width: 14, fontSize: 12, textAlign: 'center' }}
              title={text.useCommand}
              className={cursorClass}
              onClick={() => {
                if (!disabled) {
                  clearTimeout(timerRef.current);
                  setValue('/');
                  setCommandBoxVisible(true);
                  textareaRef.current?.focus();
                }
              }}
            >
              /
            </span>
            <Divider type="vertical" />
            <span title={text.clearChatHistory} className={cursorClass} onClick={handleClearHistory}>
              <IconClear size={14} />
            </span>
            <span className="flex-1"></span>
            <span className={cursorClass} title={text.chatWithContext.title} onClick={() => handleSendMessage(false)}>
              <IconEnter size={12} /> {text.chatWithContext.label}
            </span>
            <Divider type="vertical" />
            <span className={cursorClass} title={text.chat.title} onClick={() => handleSendMessage(true)}>
              {isInMac ? <MdKeyboardCommandKey size={12} /> : 'ctrl'}+
              <IconEnter size={12} /> {text.chat.label}
            </span>
          </div>
        </div>
      </div>
      {commandBoxVisible && (
        <CommandBox className="command-box" style={{ bottom: (textareaRef.current?.resizableTextArea?.textArea.offsetHeight || 30) + 32 }}>
          {filteredCommands.map((command, index) => (
            <CommandItem
              key={command}
              onClick={() => {
                handleSelectCommand(command);
              }}
              $highlight={index === selectedCommandIndex}
            >
              {command}
            </CommandItem>
          ))}
        </CommandBox>
      )}
      {children}
    </div>
  );
}
