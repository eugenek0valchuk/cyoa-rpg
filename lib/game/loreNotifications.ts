import type { HubToastItem } from '@/components/ui/HubToast'
import { isLoreCardUnlocked } from '@/lib/game/loreCards'
import { loreCardUi, loreCards } from '@/locales/ru/loreCards'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

function formatLoreToastBody(title: string): string {
  return loreCardUi.newEntryBody.replace('{title}', title)
}

/** Тосты при первом открытии записей лора (журнал, флаги, счётчики). */
export function loreUnlockToasts(
  prevHub: HubState,
  nextHub: HubState,
  prevCharacter: Character,
  nextCharacter: Character,
): HubToastItem[] {
  const toasts: HubToastItem[] = []
  const stamp = Date.now()

  for (const [index, card] of loreCards.entries()) {
    const wasUnlocked = isLoreCardUnlocked(card, prevHub, prevCharacter)
    const nowUnlocked = isLoreCardUnlocked(card, nextHub, nextCharacter)

    if (wasUnlocked || !nowUnlocked) {
      continue
    }

    toasts.push({
      id: `lore-unlock-${card.id}-${stamp}-${index}`,
      title: loreCardUi.newEntryTitle,
      body: formatLoreToastBody(card.title),
      tone: 'lore',
    })
  }

  return toasts
}
