import { usePluginState } from '../services/pluginBridge';

export const lightTheme = {
  text: 'var(--vscode-foreground, #363537)',
  textFaint: '#999',
  background: '#F0F0F0',
  border: 'solid 1px #f2f2f2',
  msgBoxBG: '#FFF',
  inputBG: '#FFF',
  stopStreamBG: 'linear-gradient(355deg, #f3f3f3, #FFF)',
  inputFieldBG: 'var(--vscode-input-background, #FFF)',
  inputFieldDisabledForground: 'var(--vscode-disabledForeground, rgba(204, 204, 204, 0.5))',
  inputFieldOutline: '#535bf2 solid 1px',
  btnBG: '#535bf2',
  btnText: '#FFF',
  primary: 'var(--vscode-textLink-foreground, #3794ff)',
  codeBG: '#F0F0F0',
  highlightBG: '#48a4ff',
  hoverBG: '#d1e8ff',
  contextMenuShadow: '0px 4px 6px rgba(100,100,100,0.1)',
  ragFileListBG: '#f3f3f3',
  ragFileListTitleBG: '#f3f3f3',
  ragFileListItemFG: '#0884ff',
  ragFileListItemHoverFG: '#48a4ff',
};

export const darkTheme = {
  text: 'var(--vscode-foreground, #ccc)',
  textFaint: '#999',
  background: '#181818',
  border: 'solid 1px #717171',
  msgBoxBG: '#242424',
  inputBG: '#2E2E2F',
  stopStreamBG: 'linear-gradient(355deg, #454545, #5e5e5e)',
  inputFieldBG: 'var(--vscode-input-background, #333)',
  inputFieldDisabledForground: 'var(--vscode-disabledForeground, rgba(97, 97, 97, 0.5))',
  inputFieldOutline: '#999 solid 1px',
  btnBG: '#535bf2',
  btnText: '#FFF',
  primary: 'var(--vscode-textLink-foreground, #3794ff)',
  codeBG: '#282c34',
  highlightBG: '#48a4ff',
  hoverBG: '#295582',
  contextMenuShadow: '0px 4px 6px rgba(0,0,0,0.1)',
  ragFileListBG: '#191919',
  ragFileListTitleBG: '#191919',
  ragFileListItemFG: '#0884ff',
  ragFileListItemHoverFG: '#48a4ff',
};

export function useTheme() {
  return usePluginState('theme');
}
