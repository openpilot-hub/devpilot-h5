import { usePluginState } from "../services/pluginBridge"
import en from "./en"
import cn from "./cn"

export type Lang = typeof en

export function useI18n(): { text: Lang, locale: 'en' | 'cn' } {
  const locale = usePluginState('locale') as 'en' | 'cn'
  if (locale === 'cn')
    return {locale, text: cn}
  else
    return {locale, text: en}
}