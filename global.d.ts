import { DevPilot, PluginConfiguration, PluginMessageHandler } from './src/typings';

declare global {
  interface Window {
    devpilot: DevPilot;
    intellijConfig?: PluginConfiguration;
    acquireVsCodeApi?: () => any;
    receiveFromIntelliJ: PluginMessageHandler;
    sendToIntelliJ?: (message: string) => void;
    ideConfig: {
      theme: 'dark' | 'light';
      locale: 'cn' | 'en';
      username: string;
      loggedIn: boolean;
      env: string;
      version: string;
      platform: string;
    };
  }
}
