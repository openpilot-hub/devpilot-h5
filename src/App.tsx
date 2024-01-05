import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, useTheme } from './themes/themes';
import './App.css'
import Chat from './pages/Chat'

function App() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Chat />
    </ThemeProvider>
  )
}

export default App
