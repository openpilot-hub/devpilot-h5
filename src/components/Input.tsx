import { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 5px;
  background-color: #555;
`;

const InputField = styled.input`
  flex: 1;
  margin-right: 10px;
  padding: 5px;
  border: 1px solid #666;
  border-radius: 4px;
  height: 40px;
  background-color: #333;
  outline: none;
  color: white;
  caret-color: #f0f0f0;
  &:focus-visible {
    outline: #999 solid 1px;
  }
`;

const SendButton = styled.button`
  background-color: #999;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;

interface InputProps {
  onSend: (value: string) => void;
}

export default function Input({ onSend }: InputProps) {
  const [value, setValue] = useState('')
  const handleSendMessage = () => {
    if (value.trim() !== '') {
      onSend(value.trim())
      setValue('')
    }
  };
  return (
    <InputContainer>
      <InputField
        type="text"
        value={value}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage()
          }
        }}
        onChange={(e) => setValue(e.target.value)}
      />
      <SendButton onClick={handleSendMessage}>Send</SendButton>
    </InputContainer>
  )
}