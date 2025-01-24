import { usePluginState } from '../services/pluginBridge';
import cn from './cn';
import en from './en';

export type I18nLang = typeof en;

export function useI18n(): { text: I18nLang; locale: 'en' | 'cn' } {
  const locale = usePluginState('locale') as 'en' | 'cn';
  if (locale === 'cn') {
    return { locale, text: cn };
  } else {
    return { locale, text: en };
  }
}
