import { describe, it, expect } from 'vitest'

import { artifacts } from '../artifacts'
import { applyChoiceEffects } from '../applyChoiceEffects'
import type { Character, Choice } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 50,
  corruption: 20,
  flags: [],
}

describe('applyChoiceEffects', () => {
  it('applies sanity and corruption deltas once', () => {
    const choice: Choice = {
      id: 'test',
      text: 'Test',
      effects: { sanity: -10, corruption: 5 },
    }

    const { updatedCharacter } = applyChoiceEffects({
      character: baseCharacter,
      choice,
      artifacts,
    })

    expect(updatedCharacter.sanity).toBe(40)
    expect(updatedCharacter.corruption).toBe(25)
  })

  it('adds flags without duplicates', () => {
    const choice: Choice = {
      id: 'test',
      text: 'Test',
      effects: { addFlag: 'heard_the_bell' },
    }

    const { updatedCharacter } = applyChoiceEffects({
      character: { ...baseCharacter, flags: ['heard_the_bell'] },
      choice,
      artifacts,
    })

    expect(updatedCharacter.flags).toEqual(['heard_the_bell'])
  })

  it('grants artifact and applies artifact stat effects', () => {
    const choice: Choice = {
      id: 'take_mask',
      text: 'Take mask',
      effects: { addArtifact: 'ashen_faceless_mask' },
    }

    const { updatedCharacter, revealedArtifact } = applyChoiceEffects({
      character: baseCharacter,
      choice,
      artifacts,
    })

    expect(revealedArtifact?.id).toBe('ashen_faceless_mask')
    expect(updatedCharacter.inventory).toHaveLength(1)
    expect(updatedCharacter.sanity).toBeLessThan(baseCharacter.sanity)
  })

  it('does not duplicate owned artifacts', () => {
    const mask = artifacts.ashen_faceless_mask
    const choice: Choice = {
      id: 'take_mask',
      text: 'Take mask',
      effects: { addArtifact: 'ashen_faceless_mask' },
    }

    const { updatedCharacter, revealedArtifact } = applyChoiceEffects({
      character: { ...baseCharacter, inventory: [mask] },
      choice,
      artifacts,
    })

    expect(revealedArtifact).toBeNull()
    expect(updatedCharacter.inventory).toHaveLength(1)
  })
})
