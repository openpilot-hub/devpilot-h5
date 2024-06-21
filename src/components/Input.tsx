import { useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import IconButton from './IconButton';
import { BsFillSendFill } from "react-icons/bs";
import TextareaAutosize from 'react-textarea-autosize';
import { QuickCommand } from '../typings';
import { useI18n } from '../i18n';
import RepoLabel from './RepoLabel';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 1280px;
  padding: 10px;
  padding-bottom: 20px;
  padding-left: 2px;
  background-color: ${props => props.theme.inputBG};
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.24);
  z-index: 1;
`;

const InputField = styled(TextareaAutosize)`
  flex: 1;
  padding: 5px 5px;
  padding-right: 2em;
  border: 1px solid #666;
  border-radius: 4px;
  background-color: ${props => props.theme.inputFieldBG};
  outline: none;
  resize: none;
  min-height: 34px;
  line-height: 24px;
  overflow-y: hidden;
  color: ${props => props.theme.text};
  caret-color: ${props => props.theme.text};
  &:focus-visible {
    outline: ${props => props.theme.inputFieldOutline};
  }
`;

const Float = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 15px;
  height: 35px;
  align-self: stretch;
  overflow: visible;
  svg {
    color: ${props => props.theme.textFaint};
  }
`

const CommandBox = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50px;
  padding: 0;
  min-width: 100px;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.codeBG};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const CommandItem = styled.div<{ $highlight: boolean }>`
  background-color: ${props => props.$highlight ? props.theme.highlightBG : 'transparent'};
  cursor: pointer;
  padding: 5px 10px;
  font-family: monospace, consolas, courier-new, sans-serif;
  &:hover {
    background-color: ${props => props.theme.hoverBG};
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
  color: ${props => props.theme.textFaint};
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
  quickCommands: string[]
  onSend: (value: string) => void,
  onHeightChanged: (height: number) => void,
}

export default function Input({ onSend, quickCommands, onHeightChanged }: InputProps) {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [prevValues, setPrevValues] = useState<string[]>([])
  const [prevIndex, setPrevIndex] = useState<number>(0)
  const { text } = useI18n();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const multilines = value.split('\n').length > 1;

  const [commandBoxVisible, setCommandBoxVisible] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(quickCommands);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const onRepoLabelClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.value = '@repo ';
    }
  }

  useEffect(() => {
    const newFilteredCommands = quickCommands.filter(cmd => cmd.startsWith(value));
    setFilteredCommands(newFilteredCommands);
    if (value === '、') {
      setValue('/');
      return
    }
    if (value === '/') {
      setCommandBoxVisible(true)
    }
    if (value === '') {
      setCommandBoxVisible(false)
    }
  }, [value, setSelectedCommandIndex])

  useEffect(() => {
    if (!textareaRef || !textareaRef.current) {
      return;
    }
    if (value === undefined || !textareaRef.current) {
      return;
    }
    onHeightChanged(textareaRef.current.scrollHeight);
  }, [value]);

  const handleClearHistory = () => {
    onSend(QuickCommand.Clear);
  }

  const handleSendMessage = () => {
    if (value.trim() !== '') {
      const newPrevValues = [...prevValues, value.trim()]
      setPrevValues(newPrevValues)
      setPrevIndex(newPrevValues.length)
      setValue('')
      onSend(value.trim())
    }
  }

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
    if (!tf)
      return;

    tf.caret0 = tf.selectionStart === 0;

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
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const tf: any = textareaRef.current;
    if (!tf)
      return;

    if (e.key === 'Escape') {
      commandBoxVisible && setCommandBoxVisible(false);
      return;
    }
    if (e.key === 'ArrowUp') {
      if (commandBoxVisible) {
        setSelectedCommandIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : filteredCommands.length - 1
        );
        e.preventDefault(); // Prevent cursor from moving in input field
      } else if (!multilines && tf.caret0) {
        let index = prevIndex - 1
        if (index < 0) {
          index = 0
          setPrevIndex(index)
        } else {
          setPrevIndex(index)
          setValue(prevValues[index])
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (commandBoxVisible) {
        setSelectedCommandIndex(prevIndex =>
          prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : 0
        );
        e.preventDefault(); // Prevent cursor from moving in input field
      } else if (!multilines) {
        if (prevIndex + 1 === prevValues.length) {
          setValue('');
        } else {
          let index = prevIndex + 1
          if (index >= prevValues.length) {
            setValue('')
          } else {
            setPrevIndex(index)
            setValue(prevValues[index])
          }
        }
      }
    }
  };

  return (
    <InputContainer>
      <IconButton size='large' icon="clear" type="fade" onClick={handleClearHistory} />
      <InputField
        ref={textareaRef}
        value={value}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={() => setTimeout(() => setCommandBoxVisible(false), 200)}
        onChange={handleChange}
      />
      <Float>
        <BsFillSendFill
          style={{
            fontSize: '1.5em',
            color: value.trim() ? theme.btnBG : theme.textFaint,
            cursor: value.trim() ? 'pointer' : 'not-allowed'
          }}
          onClick={handleSendMessage}
        />
      </Float>
      {commandBoxVisible &&
        <CommandBox>
          {filteredCommands.map((command, index) => (
            <CommandItem
              key={command}
              onClick={() => {
                handleSelectCommand(command)
              }}
              $highlight={index === selectedCommandIndex}
            >
              {command}
            </CommandItem>
          ))}
        </CommandBox>
      }
      <ShortcutHint>
        <RepoLabel
          onClick={onRepoLabelClick}
        />
        <span className='text'>
          &nbsp;{text.shortcutHint}
        </span>
      </ShortcutHint>
    </InputContainer>
  )
}