import { t } from '@/lib/i18n'

import type { RaidFlagEntry } from '@/locales/ru/raidChronicle'

export function getRaidFlagEntry(flagId: string): RaidFlagEntry {
  const known = t.raidChronicle.flags[flagId]

  if (known) {
    return known
  }

  const fallbackLabel = flagId
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  return {
    label: fallbackLabel,
    blurb: 'Метка без названия. Мир всё равно её помнит.',
    gameplay: 'Может повлиять на пути и финал спуска.',
  }
}

export function getRaidFlagIds(flags: string[]): string[] {
  return Array.from(new Set(flags)).sort()
}
