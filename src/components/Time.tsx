import { useState } from 'react';
import { useGlobalInterval } from '../hooks/useGlobalInterval';
import { getRelativeTime } from '../services/util';
import styled from 'styled-components';

const Text = styled.span`
  color: ${props => props.theme.textFaint};
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.01em;
`

function Time(props: any) {
  const [time, setTime] = useState('');
  useGlobalInterval(() => {
    setTime(getRelativeTime(props.date))
  }, 60000);

  return (
    <Text {...props}>
      {time || getRelativeTime(props.date)}
    </Text>
  )
}

export default Time;