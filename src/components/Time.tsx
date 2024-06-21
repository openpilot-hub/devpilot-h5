import { useEffect, useState } from 'react';
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

function Time({ date, locale }: { date: Date | number; locale: 'en' | 'cn' }) {

  const [time, setTime] = useState(getRelativeTime(date, locale));

  useEffect(() => {
    setTime(getRelativeTime(date, locale))
    const interval = setInterval(() => {
      setTime(getRelativeTime(date, locale))
    }, 60000);

    return () => {
      clearInterval(interval)
    };
  }, [date, locale])

  return <Text>{time}</Text>
}

export default Time;