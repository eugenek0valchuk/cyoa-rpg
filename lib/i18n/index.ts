import { ru } from '@/locales/ru'

import { DEFAULT_LOCALE, type Locale } from './config'

const bundles = {
  ru,
} as const

export function getLocaleBundle(locale: Locale = DEFAULT_LOCALE) {
  return bundles[locale]
}

export const t = getLocaleBundle()
