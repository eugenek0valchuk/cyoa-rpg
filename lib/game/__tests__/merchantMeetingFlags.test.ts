import { describe, expect, it } from 'vitest'

import { sceneRegistry } from '../sceneRegistry'
import { discoverJournalEntries } from '../journal'
import { applyChoiceEffects } from '../applyChoiceEffects'
import { artifacts } from '../artifacts'
import type { Character } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 50,
  corruption: 20,
  flags: [],
}

describe('merchant meeting flags', () => {
  const merchant = sceneRegistry.merchant

  it('sets met_breathless when leaving the cart', () => {
    const leave = merchant?.options.find((option) => option.id === 'leave_cart')
    expect(leave).toBeDefined()

    const { updatedCharacter } = applyChoiceEffects({
      character: baseCharacter,
      choice: leave!,
      artifacts,
    })

    expect(updatedCharacter.flags).toContain('met_breathless')
  })

  it('sets met_breathless and claimed_mask when taking the mask', () => {
    const takeMask = merchant?.options.find((option) => option.id === 'take_mask')
    expect(takeMask).toBeDefined()

    const { updatedCharacter } = applyChoiceEffects({
      character: baseCharacter,
      choice: takeMask!,
      artifacts,
    })

    expect(updatedCharacter.flags).toEqual(['claimed_mask', 'met_breathless'])
  })

  it('does not unlock breathless journal before a choice is committed', () => {
    const found = discoverJournalEntries({
      flags: [],
      sceneIds: ['merchant'],
      unlocked: [],
    })

    expect(found).not.toContain('npc_breathless')
  })

  it('unlocks breathless journal after met_breathless flag from choice', () => {
    const found = discoverJournalEntries({
      flags: ['met_breathless'],
      sceneIds: [],
      unlocked: [],
    })

    expect(found).toContain('npc_breathless')
  })
})
