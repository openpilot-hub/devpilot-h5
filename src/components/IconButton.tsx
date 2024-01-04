import React, { useCallback } from 'react';
import { AiFillCopy, AiFillLike, AiFillDislike } from "react-icons/ai";
import styled from 'styled-components';

interface IconButtonProps {
  icon: 'copy' | 'like' | 'dislike'
  type: 'fade' | 'toggle'
  onClick: () => void
}

const Button = styled.button`
  background-color: transparent;
  color: #fff;
  border: none;
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease;
  &:focus {
    outline: none;
  }
  &.active {
    background-color: #007bff;
  }
`;

const IconButton: React.FC<IconButtonProps> = ({ type, icon, onClick }) => {
  const [toggled, setToggled] = React.useState(false);
  const clicked = useCallback(() => {
    if (type === 'fade') {
      setToggled(true);
      setTimeout(() => {
        setToggled(false);
      }, 500)
    } else {
      setToggled(toggled => !toggled)
    }
    onClick()
  }, [])
  return (
    <Button
      aria-label={icon}
      title={icon}
      className={toggled && 'active' || ''}
      onClick={clicked}
    >
      {icon === 'copy' && <AiFillCopy />}
      {icon === 'like' && <AiFillLike />}
      {icon === 'dislike' && <AiFillDislike />}
    </Button>
  )
}

export default IconButton
