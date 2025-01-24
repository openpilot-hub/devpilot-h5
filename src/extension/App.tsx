import '@/assets/styles/animation.less';
import './App.css';

import ErrorBoundary from '@/components/ErrorBoundary';
import NeedLogin from '@/pages/NeedLogin';
import { usePluginState } from '@/services/pluginBridge';
import { isDevelopment, sleep } from '@/utils';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Chat from '../pages/Chat';
import { useStyleTheme, useTheme } from '../themes/themes';

function App() {
  const loggedIn = usePluginState('loggedIn');
  const theme = useTheme();
  const styleTheme = useStyleTheme(theme);

  useMemo(() => {
    if (theme === 'light') {
      document.body.classList.add('devpilot-light');
      document.body.classList.remove('devpilot-dark');
    } else {
      document.body.classList.add('devpilot-dark');
      document.body.classList.remove('devpilot-light');
    }
    document.body.style.cssText = Object.keys(styleTheme)
      .map((key) => `--${key}:${(styleTheme as any)[key]}`)
      .join(';');
  }, [theme]);

  return (
    <ConfigProvider
      theme={{
        // cssVar: true,
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: styleTheme.primaryColor,
        },
        components: {
          Dropdown: {
            colorBgElevated: styleTheme.colorBgElevated,
            colorText: styleTheme.text,
            controlItemBgHover: styleTheme.itemActiveBg,
          },
          Input: {
            colorText: styleTheme.text,
            colorTextPlaceholder: styleTheme.inputPlaceholder,
            colorBgContainer: styleTheme.inputContainerBG,
            colorBgContainerDisabled: styleTheme.inputContainerBG,
          },
        },
      }}
    >
      <ThemeProvider theme={styleTheme}>
        <ErrorBoundary>{loggedIn ? <Chat /> : <NeedLogin />}</ErrorBoundary>
      </ThemeProvider>
    </ConfigProvider>
  );
}

function waitReady(): Promise<boolean> {
  if (isDevelopment() || window.acquireVsCodeApi || window.sendToIntelliJ) {
    return Promise.resolve(true);
  }
  return sleep(10).then(waitReady);
}

export default function AppWrapper() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    waitReady().then(setReady);
  }, []);

  if (!ready) {
    return null;
  }

  return <App />;
}
