import styled, { keyframes } from "styled-components";
import { FaRegStopCircle } from "react-icons/fa";
import React, { forwardRef } from 'react';
import { useI18n } from "../i18n";

const sineFadeAnimation = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
`;

const StopButtonContainer = styled.div`
  position: absolute;
  bottom: 70px;
  width: 100%;
  z-index: 1;
`

const StopButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100px;
  height: 40px;
  font-size: 16px;
  margin: 0 auto;
  border-radius: 200px;
  background: none;
  overflow: hidden;
  color: ${props => props.theme.text};
  height: 40px;
  box-shadow: 0 3px 5px #0002;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #646cff;
    outline: none;
  }
  &:focus {
    outline: 2px solid #646cff;
  }
`

const StopButtonBackground = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: -1;
  width: 120px;
  height: 60px;
  animation: ${sineFadeAnimation} 0.6s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate;
  background-image: ${props => props.theme.stopStreamBG};
`

export default forwardRef<HTMLDivElement, {onClick: () => void}>((props, ref) => {
  const {text} = useI18n()
  return (
    <StopButtonContainer {...props} ref={ref}>
      <StopButton>
        <StopButtonBackground />
        <FaRegStopCircle /> {text.stop}
      </StopButton>
    </StopButtonContainer>
  )
})
