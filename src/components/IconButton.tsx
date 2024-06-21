import React, { useCallback } from 'react';
import { AiFillCopy, AiFillLike, AiFillDislike, AiFillFileAdd } from "react-icons/ai";
import { GiBroom } from "react-icons/gi";
import { RiInputCursorMove } from "react-icons/ri";
import { LuReplace } from "react-icons/lu";
import { VscGoToFile } from "react-icons/vsc";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import styled from 'styled-components';

type Size = 'small' | 'medium' | 'large'
type Icon = 'copy' | 'like' | 'dislike' | 'cursor' | 'replace' | 'file' | 'goto' | 'clear' | 'retry' | 'more'

interface IconButtonProps {
  icon: Icon
  type: 'static' | 'fade' | 'toggle' | 'activable'
  size?: Size
  title?: string
  onClick?: () => void
}

const buttonSizeMapping: { [key in Size]: string } = {
  large: '22px;',
  medium: '14px;',
  small: '12px;'
}

const Button = styled.div<{size: Size}>`
  background-color: transparent;
  color: ${props => props.theme.text};
  border: none;
  padding: 5px;
  border-radius: 4px;
  line-height: 1ex;
  font-size: ${props => buttonSizeMapping[props.size as Size]}
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #d1e8ff90;
  }
  &:focus {
    outline: none;
  }
  &.active {
    background-color: #007bff;
  }
`

const IconButton: React.FC<IconButtonProps> = ({ type, icon, size, title, onClick }) => {
  const [toggled, setToggled] = React.useState(false)
  const clicked = () => {
    if (type === 'fade') {
      setToggled(true);
      setTimeout(() => {
        setToggled(false);
      }, 300)
    } else if (type === 'toggle') {
      setToggled(toggled => !toggled)
    } else if (type === 'activable') {
      setToggled(true)
    }
    onClick?.()
  }
  return (
    <Button
      aria-label={icon}
      title={title || icon}
      data-tooltip-id="tooltip"
      data-tooltip-content={title}
      className={'icon-button ' + (toggled && 'active' || '')}
      size={size || 'small'}
      onClick={clicked}
    >
      {icon === 'copy' && <AiFillCopy />}
      {icon === 'like' && <AiFillLike />}
      {icon === 'dislike' && <AiFillDislike />}
      {icon === 'cursor' && <RiInputCursorMove />}
      {icon === 'replace' && <LuReplace />}
      {icon === 'file' && <AiFillFileAdd />}
      {icon === 'goto' && <VscGoToFile />}
      {icon === 'clear' && <GiBroom />}
      {icon === 'retry' && <FaArrowRotateLeft />}
      {icon === 'more' && <BsThreeDots />}
    </Button>
  )
}

export default IconButton
