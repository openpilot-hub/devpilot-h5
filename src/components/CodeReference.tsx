import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { CodeReference, PluginCommand } from '../typings';
import { sendToPlugin } from '../services/pluginBridge';
import { TbCodeDots as CodeIcon } from "react-icons/tb";
import { useI18n } from '../i18n';

const blinkFade = keyframes`
  0% {
    background-color: #48a4ff;
  }
  100% {
    background-color: ${props => props.theme.codeBG};
  }
`;

const CodeRefContainer = styled.div<{ $animate: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.codeBG};
  border: ${props => props.theme.border};
  padding: 8px 8px;
  margin: 5px 0;
  border-radius: 5px;
  width: auto;
  cursor: pointer;
  overflow: hidden;
  gap: 5px;
  
  ${props => props.$animate && css`
    animation: ${blinkFade} 1s ease;
  `}
`

const Filename = styled.div`
  font-weight: bold;
  line-height: 1;
  flex-basis: 100%;
  flex-shrink: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Lines = styled.span`
  padding-top: 2px;
  font-weight: normal;
  margin-right: 5px;
  line-height: 1;
  flex-shrink: 0;
  color: ${props => props.theme.textFaint};
`

const RightPadding = styled.div`
  flex-shrink: 0;
`

const Icon = styled.span`
  font-size: 20px;
  flex-grow: 0;
  flex-shrink: 0;
  color: ${props => props.theme.primary};
  line-height: 1ex;
`

const CodeReferenceView: React.FC<CodeReference> = (props: CodeReference) => {
  const { text } = useI18n();
  const [animate, setAnimate] = useState(false);

  const handleOnClick = () => {
    setAnimate(true);
    sendToPlugin(PluginCommand.GotoSelectedCode, props);
    setTimeout(() => setAnimate(false), 200);
  }

  const {
    fileName,
    selectedStartLine,
    selectedEndLine,
  } = props
  return (
    <CodeRefContainer
      $animate={animate}
      onClick={handleOnClick}
    >
      <div>{text.quoted}:&nbsp;&nbsp;</div>
      <Icon><CodeIcon /></Icon>
      <Filename>{fileName}:</Filename><Lines>{selectedStartLine}-{selectedEndLine}</Lines>
      <RightPadding />
    </CodeRefContainer>
  )
}

export default CodeReferenceView
