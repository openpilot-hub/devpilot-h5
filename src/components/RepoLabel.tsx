import styled from 'styled-components'
import { usePluginState } from '../services/pluginBridge';
import { useI18n } from '@/i18n';

const Label = styled.div`
  display: flex;
  gap: 5px;
  height: 20px;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
  color: ${props => props.theme.textFaint};
  flex-shrink: 0;
`

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  &.embedding {
    background: #00f050;
  }
  margin-top: 2px;
`

export default function RepoLabel({onClick}: {onClick: () => void}) {
  const {name, embedding} = usePluginState('repo');
  const { text } = useI18n();
  if (!name) {
    return <></>
  }
  return (
    <Label
      data-tooltip-id="tooltip"
      data-tooltip-html={embedding ? text.repoEmbedded : text.applyRepoEmbedding}
      onClick={() => embedding && onClick()}>
      <Dot className={embedding && 'embedding' || ''} />
      {name}&nbsp;|
    </Label>
  )
};