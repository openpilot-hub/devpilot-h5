import './App.css';

import ErrorBoundary from '@/components/ErrorBoundary';
import NeedLogin from '@/pages/NeedLogin';
import { usePluginState } from '@/services/pluginBridge';
import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import Chat from '../pages/Chat';
import { darkTheme, lightTheme, useTheme } from '../themes/themes';

function App() {
  const loggedIn = usePluginState('loggedIn');
  const theme = useTheme();
  // const theme = 'dark';

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('devpilot-light');
      document.body.classList.remove('devpilot-dark');
    } else {
      document.body.classList.add('devpilot-dark');
      document.body.classList.remove('devpilot-light');
    }
  }, [theme]);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <ErrorBoundary>{loggedIn ? <Chat /> : <NeedLogin />}</ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
