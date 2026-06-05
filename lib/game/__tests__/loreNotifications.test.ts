import { describe, expect, it } from 'vitest'

import { loreUnlockToasts } from '@/lib/game/loreNotifications'
import type { Character } from '@/lib/types/game'
import { createInitialHubState } from '@/lib/types/hub'

function witnessCharacter(flags: string[] = []): Character {
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

describe('lore unlock toasts', () => {
  it('emits toast when journal unlocks a lore card', () => {
    const prevHub = createInitialHubState()
    const nextHub = {
      ...prevHub,
      journalEntries: ['npc_wax'],
    }
    const character = witnessCharacter()

    const toasts = loreUnlockToasts(prevHub, nextHub, character, character)

    expect(toasts).toHaveLength(1)
    expect(toasts[0]?.title).toBeTruthy()
    expect(toasts[0]?.body).toContain('Восковой паломник')
    expect(toasts[0]?.tone).toBe('lore')
  })

  it('emits toast when flag unlocks a lore card', () => {
    const hub = createInitialHubState()
    const prevCharacter = witnessCharacter()
    const nextCharacter = witnessCharacter(['met_breathless'])

    const toasts = loreUnlockToasts(hub, hub, prevCharacter, nextCharacter)

    expect(toasts).toHaveLength(1)
    expect(toasts[0]?.body).toContain('Бездыханный')
  })

  it('skips already unlocked cards', () => {
    const hub = {
      ...createInitialHubState(),
      journalEntries: ['npc_wax'],
    }
    const character = witnessCharacter()

    const toasts = loreUnlockToasts(hub, hub, character, character)

    expect(toasts).toHaveLength(0)
  })
})
