import { useState } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 5px 10px;
  background-color: ${props => props.theme.inputBG};
`;

const InputField = styled.input`
  flex: 1;
  margin-right: 10px;
  padding: 5px;
  border: 1px solid #666;
  border-radius: 4px;
  height: 40px;
  background-color: ${props => props.theme.inputFieldBG};
  outline: none;
  color: ${props => props.theme.text};
  caret-color: ${props => props.theme.text};
  &:focus-visible {
    outline: ${props => props.theme.inputFieldOutline};
  }
`;

const SendButton = styled.button`
  background-color: ${props => props.theme.btnBG};
  color: ${props => props.theme.btnText};
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;

interface InputProps {
  onSend: (value: string) => void
}

export default function Input({ onSend }: InputProps) {
  const [value, setValue] = useState('');
  const [prevValues, setPrevValues] = useState<string[]>([])
  const [prevIndex, setPrevIndex] = useState<number>(0)

  const handleSendMessage = () => {
    if (value.trim() !== '') {
      const newPrevValues = [...prevValues, value.trim()]
      setPrevValues(newPrevValues)
      setPrevIndex(newPrevValues.length)
      setValue('')
      onSend(value.trim())
    }
  }

  return (
    <InputContainer>
      <InputField
        type="text"
        value={value}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage()
          } else if (e.key === 'ArrowUp') {
            let index = prevIndex - 1
            if (index < 0) index = prevValues.length - 1
            setPrevIndex(index)
            setValue(prevValues[index])
          } else if (e.key === 'ArrowDown') {
            let index = prevIndex + 1
            if (index >= prevValues.length) index = 0
            setPrevIndex(index)
            setValue(prevValues[index])
          }
        }}
        onChange={(e) => setValue(e.target.value)}
      />
      <SendButton onClick={handleSendMessage}>Send</SendButton>
    </InputContainer>
  )
}