import { useEffect, useState } from "react";
import { readThemeFromPlugin } from "../services/pluginBridge";

export const lightTheme = {
  text: '#363537',
  background: '#F0F0F0',
  msgBoxBG: '#FFF',
  inputBG: '#FFF',
  inputFieldBG: '#FFF',
  inputFieldOutline: '#535bf2 solid 1px',
  btnBG: '#535bf2',
  btnText: '#FFF',
}

export const darkTheme = {
  text: '#FAFAFA',
  background: '#363537',
  msgBoxBG: '#555',
  inputBG: '#555',
  inputFieldBG: '#333',
  inputFieldOutline: '#999 solid 1px',
  btnBG: '#535bf2',
  btnText: '#FFF',
}

export function useTheme() {
  const [theme, setTheme] = useState<'light'|'dark'>('light');
  useEffect(() => {
    (async () => {
      const theme = await readThemeFromPlugin();
      setTheme(theme)
    })()
  }, [])
  return theme
}