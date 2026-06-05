import { describe, expect, it } from 'vitest'

import {
  countUnreadLoreCards,
  countUnlockedLoreCards,
  getLoreCard,
  getLoreSections,
  isLoreCardUnlocked,
  markLoreCardRead,
} from '../loreCards'
import type { Character } from '@/lib/types/game'
import { createInitialHubState } from '@/lib/types/hub'

function baseCharacter(flags: string[] = []): Character {
  return {
    name: 'Test',
    origin: 'witness',
    stats: { strength: 10, agility: 10, intelligence: 10 },
    sanity: 50,
    corruption: 10,
    flags,
    inventory: [],
  }
}

describe('loreCards', () => {
  it('returns faction cards', () => {
    expect(getLoreCard('synod')?.title).toBe('Синод под Вуалью')
    expect(getLoreCard('missing')).toBeNull()
  })

  it('always unlocks world lore entries', () => {
    const hub = createInitialHubState()
    const card = getLoreCard('procession')

    expect(card).not.toBeNull()
    expect(isLoreCardUnlocked(card!, hub, baseCharacter())).toBe(true)
  })

  it('locks face entries until journal or flag', () => {
    const hub = createInitialHubState()
    const card = getLoreCard('breathless')

    expect(isLoreCardUnlocked(card!, hub, baseCharacter())).toBe(false)
    expect(
      isLoreCardUnlocked(
        card!,
        hub,
        baseCharacter(['met_breathless']),
      ),
    ).toBe(true)
  })

  it('unlocks chamber lore after first extraction', () => {
    const hub = createInitialHubState()
    const card = getLoreCard('machine')

    expect(isLoreCardUnlocked(card!, hub, baseCharacter())).toBe(false)
    expect(
      isLoreCardUnlocked(
        card!,
        { ...hub, totalExtractions: 1 },
        baseCharacter(),
      ),
    ).toBe(true)
  })

  it('groups cards into four chronicle sections', () => {
    const sections = getLoreSections(createInitialHubState(), baseCharacter())

    expect(sections).toHaveLength(4)
    expect(sections.map((section) => section.category)).toEqual([
      'world',
      'faces',
      'chamber',
      'curses',
    ])
    expect(sections[0]?.cards.length).toBeGreaterThanOrEqual(5)
  })

  it('counts unlocked lore cards for tab badge', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1, totalRaids: 2 }
    const unlocked = countUnlockedLoreCards(hub, baseCharacter(['met_breathless']))

    expect(unlocked).toBeGreaterThan(5)
  })

  it('tracks unread lore until card is opened', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = baseCharacter()

    expect(countUnreadLoreCards(hub, character)).toBeGreaterThan(0)

    const read = markLoreCardRead(hub, 'machine')
    expect(countUnreadLoreCards(read, character)).toBe(
      countUnreadLoreCards(hub, character) - 1,
    )
    expect(markLoreCardRead(read, 'machine')).toBe(read)
  })

  it('includes folio card after journal unlock', () => {
    const hub = {
      ...createInitialHubState(),
      journalEntries: ['mystery_folio'],
    }

    expect(isLoreCardUnlocked(getLoreCard('folio_mystery')!, hub, baseCharacter())).toBe(
      true,
    )
  })
})
