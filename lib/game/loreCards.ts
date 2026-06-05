import {
  LORE_CARD_CATEGORY_ORDER,
  loreCardById,
  loreCards,
  type LoreCardCategory,
  type LoreCardDef,
} from '@/locales/ru/loreCards'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

export type { LoreCardDef, LoreCardCategory }

export type LoreCardView = LoreCardDef & {
  unlocked: boolean
  unread: boolean
}

export type LoreSectionView = {
  category: LoreCardCategory
  cards: LoreCardView[]
  unlockedCount: number
}

export function getLoreCard(id: string): LoreCardDef | null {
  return loreCardById[id] ?? null
}

export function isLoreCardRead(hub: HubState, cardId: string): boolean {
  return (hub.loreReadIds ?? []).includes(cardId)
}

export function markLoreCardRead(hub: HubState, cardId: string): HubState {
  const read = new Set(hub.loreReadIds ?? [])

  if (read.has(cardId)) {
    return hub
  }

  return {
    ...hub,
    loreReadIds: [...read, cardId],
  }
}

export function countUnreadLoreCards(
  hub: HubState,
  character: Character,
): number {
  return loreCards.filter(
    (card) =>
      isLoreCardUnlocked(card, hub, character) &&
      !isLoreCardRead(hub, card.id),
  ).length
}

export function isLoreCardUnlocked(
  card: LoreCardDef,
  hub: HubState,
  character: Character,
): boolean {
  const unlock = card.unlock

  if (!unlock || unlock.always) {
    return true
  }

  const journal = new Set(hub.journalEntries ?? [])
  const flags = new Set(character.flags ?? [])

  if (unlock.journal && journal.has(unlock.journal)) {
    return true
  }

  if (unlock.flag && flags.has(unlock.flag)) {
    return true
  }

  if (unlock.minExtractions != null) {
    return (hub.totalExtractions ?? 0) >= unlock.minExtractions
  }

  if (unlock.minRaids != null) {
    return (hub.totalRaids ?? 0) >= unlock.minRaids
  }

  return false
}

export function getLoreSections(
  hub: HubState,
  character: Character,
): LoreSectionView[] {
  return LORE_CARD_CATEGORY_ORDER.map((category) => {
    const cards = loreCards
      .filter((card) => card.category === category)
      .map((card) => {
        const unlocked = isLoreCardUnlocked(card, hub, character)

        return {
          ...card,
          unlocked,
          unread: unlocked && !isLoreCardRead(hub, card.id),
        }
      })

    return {
      category,
      cards,
      unlockedCount: cards.filter((card) => card.unlocked).length,
    }
  }).filter((section) => section.cards.length > 0)
}

export function countUnlockedLoreCards(
  hub: HubState,
  character: Character,
): number {
  return loreCards.filter((card) => isLoreCardUnlocked(card, hub, character))
    .length
}
