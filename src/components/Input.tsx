import { disposeHandler, receiveFromPlugin } from '@/services/pluginBridge';
import { useEffect, useRef, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import TextareaAutosize from 'react-textarea-autosize';
import styled, { useTheme } from 'styled-components';
import { useI18n } from '../i18n';
import { CodeReference, PluginCommand, QuickCommand } from '../typings';
import FileReference from './FileReference';
import IconButton from './IconButton';

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  max-width: 1280px;
  padding: 10px;
  padding-bottom: 20px;
  padding-left: 2px;
  background-color: ${(props) => props.theme.inputBG};
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.24);
  z-index: 1;
`;

const Textarea = styled(TextareaAutosize)`
  flex: 1;
  padding: 8px 2.5em 8px 8px;
  border: 1px solid #666;
  border-radius: 4px;
  background-color: ${(props) => props.theme.inputFieldBG};
  outline: none;
  resize: none;
  font-size: 13px;
  color: ${(props) => props.theme.text};
  caret-color: currentColor;
  line-height: 20px;
  &[disabled] {
    color: ${(props) => props.theme.inputFieldDisabledForground};
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: ${(props) => props.theme.inputFieldOutline};
  }
`;

const Float = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 16px;
  height: 32px;
  align-self: stretch;
  overflow: visible;
  svg {
    color: ${(props) => props.theme.textFaint};
  }
`;

const CommandBox = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50px;
  padding: 0;
  min-width: 100px;
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme.codeBG};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CommandItem = styled.div<{ $highlight: boolean }>`
  background-color: ${(props) => (props.$highlight ? props.theme.highlightBG : 'transparent')};
  color: ${(props) => (props.$highlight ? '#fff' : 'inherit')};
  cursor: pointer;
  padding: 5px 10px;
  font-family: monospace, consolas, courier-new, sans-serif;
  &:hover {
    background-color: ${(props) => props.theme.hoverBG};
  }
`;

const ShortcutHint = styled.div`
  position: absolute;
  bottom: 0;
  left: 36px;
  height: 20px;
  padding: 3px 0 0;
  min-width: 100px;
  width: calc(100% - 46px);
  font-size: 12px;
  line-height: 1;
  color: ${(props) => props.theme.textFaint};
  display: flex;
  flex-direction: row;
  .text {
    overflow: hidden;
    flex-basic: 100%;
    flex-shrink: 1;
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
  }
`;

interface InputProps {
  onSend: (value: string, codeRef?: CodeReference) => void;
  quickCommands: string[];
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function Input({ onSend, quickCommands, children, disabled }: InputProps) {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [prevValues, setPrevValues] = useState<string[]>([]);
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const { text } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [codeRef, setCodeRef] = useState<CodeReference>();
  const [commandBoxVisible, setCommandBoxVisible] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(quickCommands);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  // const onRepoLabelClick = () => {
  //   if (textareaRef.current) {
  //     textareaRef.current.focus();
  //     textareaRef.current.value = '@repo ';
  //   }
  // };

  useEffect(() => {
    const newFilteredCommands = quickCommands.filter((cmd) => cmd.startsWith(value));
    setFilteredCommands(newFilteredCommands);
    if (value === '、') {
      setValue('/');
      return;
    }
    if (value === '/') {
      setCommandBoxVisible(true);
    }
    if (value === '') {
      setCommandBoxVisible(false);
    }
  }, [value, setSelectedCommandIndex]);

  useEffect(() => {
    const handle = receiveFromPlugin(PluginCommand.ReferenceCode, (payload) => setCodeRef(payload));
    return () => disposeHandler(handle);
  }, []);

  const handleClearHistory = () => {
    onSend(QuickCommand.Clear);
  };

  const clearCodeRef = () => {
    setCodeRef(undefined);
  };

  const handleSendMessage = () => {
    if (value.trim()) {
      const newPrevValues = [...prevValues, value.trim()];
      setPrevValues(newPrevValues);
      setPrevIndex(newPrevValues.length);
      setValue('');
      onSend(value.trim(), codeRef);
      clearCodeRef();
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
      if (commandBoxVisible) {
        const command = filteredCommands[selectedCommandIndex];
        if (command) {
          handleSelectCommand(command);
          e.preventDefault();
        } else {
          e.preventDefault();
          handleSendMessage();
        }
      } else if (!e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
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
    <InputContainer className="input-container">
      <IconButton size="large" icon="clear" type="static" onClick={handleClearHistory} style={{ alignSelf: 'start' }} />
      <Textarea
        ref={textareaRef}
        disabled={disabled}
        value={value}
        className="hide-scrollbar"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={() => setTimeout(() => setCommandBoxVisible(false), 200)}
        onChange={handleChange}
        autoFocus
        maxRows={10}
        style={codeRef ? { paddingBottom: 40 } : undefined}
        placeholder={text.inputPlaceholder}
      />
      {codeRef && <FileReference codeRef={codeRef} onRemove={clearCodeRef} />}
      <Float className="icon-send">
        <BsFillSendFill
          style={{
            fontSize: 16,
            color: value.trim() ? theme.btnBG : theme.textFaint,
            cursor: value.trim() ? 'pointer' : 'not-allowed',
          }}
          onClick={handleSendMessage}
        />
      </Float>
      {commandBoxVisible && (
        <CommandBox className="command-box">
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
      <ShortcutHint className="shortcut-hit">
        {/* <RepoLabel onClick={onRepoLabelClick} /> */}
        <span className="text">{text.shortcutHint}</span>
        {/* <span className="text">&nbsp;{text.shortcutHint}</span> */}
      </ShortcutHint>
      {children}
    </InputContainer>
  );
}
