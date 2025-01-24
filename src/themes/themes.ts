import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { usePluginState } from '../services/pluginBridge';

export const lightTheme = {
  primaryColor: 'var(--vscode-textLink-foreground, #0e639c)',
  inputContainerBG: '#FFF',
  itemActiveBg: '#F5F7FA',
  itemBorderColor: '#E1E4EA',
  referenceBg: '#F5F7FA',
  text: '#363537', // #616161
  textFaint: '#999',
  border: 'solid 1px #f2f2f2',
  msgBoxBG: '#FFF',
  stopStreamBG: 'linear-gradient(355deg, #f3f3f3, #fff)',
  inputBackground: 'var(--vscode-input-background, #fff)',
  inputPlaceholder: 'var(--vscode-editor-placeholder-foreground, rgba(0,0,0,0.47))',
  // inputActiveBorderColor: '#424242',
  // btnBG: '#535bf2',
  codeBG: '#F0F0F0',
  // highlightBG: '#48a4ff',
  // hoverBG: '#d1e8ff',
  // contextMenuShadow: '0px 4px 6px rgba(100,100,100,0.1)',
  // ragFileListBG: '#f3f3f3',
  // ragFileListTitleBG: '#f3f3f3',
  // ragFileListItemFG: '#0884ff',
  // ragFileListItemHoverFG: '#48a4ff',
  colorBgElevated: '#FFFFFF',
};

export const darkTheme = {
  primaryColor: 'var(--vscode-textLink-foreground, #0e639c)',
  inputContainerBG: '#2E2E2F',
  itemActiveBg: '#4A4A4A',
  itemBorderColor: '#474747',
  referenceBg: 'transparent',
  text: '#ccc',
  textFaint: '#999',
  border: 'solid 1px #717171',
  msgBoxBG: '#2E2E2F',
  stopStreamBG: 'linear-gradient(355deg, #454545, #5e5e5e)',
  inputBackground: 'var(--vscode-input-background, #3c3c3c)',
  inputPlaceholder: 'var(--vscode-editor-placeholder-foreground, rgba(255, 255, 255, 0.34))',
  // inputActiveBorderColor: '#b0b0b0',
  // btnBG: '#535bf2',
  codeBG: '#282c34',
  // highlightBG: '#48a4ff',
  // hoverBG: '#295582',
  // contextMenuShadow: '0px 4px 6px rgba(0,0,0,0.1)',
  // ragFileListBG: '#191919',
  // ragFileListTitleBG: '#191919',
  // ragFileListItemFG: '#0884ff',
  // ragFileListItemHoverFG: '#48a4ff',
  colorBgElevated: '#373738',
};

export function useTheme() {
  // return 'dark';
  return usePluginState('theme');
}

export function useStyleTheme(theme: string) {
  return theme === 'dark' ? darkTheme : lightTheme;
}

export function useSyntaxTheme() {
  const theme = useTheme();
  return theme === 'dark' ? oneDark : oneLight;
}
