import { loreCardById, type LoreCardDef } from '@/locales/ru/loreCards'

export type { LoreCardDef }

export function getLoreCard(id: string): LoreCardDef | null {
  return loreCardById[id] ?? null
}
