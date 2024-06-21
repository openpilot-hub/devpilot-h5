import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, useTheme } from '../themes/themes';
import './App.css';
import Chat from '../pages/Chat';
import { usePluginState } from '@/services/pluginBridge';
import NeedLogin from '@/pages/NeedLogin';
import { useEffect } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  const loggedIn = usePluginState('loggedIn');
  const theme = useTheme();

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
