import React, { useState, useEffect } from 'react';
import { Message } from '../typings';
import Markdown from './Markdown';
import styled from 'styled-components';
import IconButton from './IconButton';
import Devpilot from '../assets/devpilot.svg'
import User from '../assets/user.svg'
import Loading from './Loading';
import { sendToPlugin } from '../services/pluginBridge';

const MessageBubbleContainer = styled.div`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.msgBoxBG};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

const Username = styled.span`
  font-weight: bold;
  margin-right: 10px;
`

const Time = styled.span`
  font-size: 12px;
  color: #999;
`

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
  position: absolute;
  top: 10px;
  right: 10px;
`

const MessageBubble: React.FC<Message> = (message: Message) => {
  let { username, avatar, content, role, time } = message

  avatar = avatar || (role === 'assistant' ? Devpilot : User)

  username = username ||
    (role === 'assistant' ? 'Devpilot' : role === 'user' ? 'User' : role === 'system' ? 'System' : '')

  time = time || '00:00'

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (content === '...') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [content])

  const copyThisMessage = () => {
    navigator.clipboard.writeText(content);
  }

  const likeThisMessage = () => {
    sendToPlugin('Like', { message })
  }

  const dislikeThisMessage = () => {
    sendToPlugin('Dislike', { message })
  }

  return (
    <MessageBubbleContainer>
      <HeaderContainer>
        <Avatar src={avatar} alt={username} className="avatar" />
        <RightSide>
          <Username>{username}</Username>
          <Time>{time}</Time>
        </RightSide>
      </HeaderContainer>
      {message.role === 'assistant' &&
        <ActionBar>
          <IconButton type='fade' icon='copy' onClick={copyThisMessage} />
          <IconButton type='toggle' icon='like' onClick={likeThisMessage} />
          <IconButton type='toggle' icon='dislike' onClick={dislikeThisMessage} />
        </ActionBar>
      }
      {isLoading ? <Loading /> : <Markdown markdown={content} />}
    </MessageBubbleContainer>
  )
}

export default MessageBubble
