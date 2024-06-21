import { FC } from 'react';
import { useI18n } from '@/i18n';
import Devpilot from '../assets/devpilot.svg'
import styled from 'styled-components';
import { sendToPlugin } from '@/services/pluginBridge';
import { PluginCommand } from '@/typings';

const Login = styled.div`
  height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 20px;
  .logo {
    display: inline-block;
    width: 26.77px;
    height: 24px;
    vertical-align: -6px;
    padding-right: 6px;
  }
  a {
    text-decoration: none;
    cursor: pointer;
  }
`

const NeedLogin: FC = () => {
  const { text } = useI18n();
  return (
    <Login>
      <img src={Devpilot} className="logo" />
      {text.errorMessage.needLogin}
      <div style={{ marginTop: '10px' }}>
        <a
          onClick={() => {
            sendToPlugin(PluginCommand.Login)
          }}
        >
          {text.login}
        </a>
      </div>
    </Login>
  )
};

export default NeedLogin;