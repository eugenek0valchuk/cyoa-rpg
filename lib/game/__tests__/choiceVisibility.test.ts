import { describe, it, expect } from 'vitest'
import { isChoiceVisible } from '../choiceVisibility'
import type { Character, Choice } from '@/lib/types/game'

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    name: 'Test',
    origin: 'hollow',
    stats: { strength: 5, agility: 5, intelligence: 5 },
    inventory: [],
    sanity: 50,
    corruption: 30,
    flags: [],
    ...overrides,
  }
}

function makeChoice(
  overrides: Partial<Choice> = {},
  requirements?: Choice['requirements'],
): Choice {
  return {
    id: 'test_choice',
    text: 'Test choice',
    requirements,
    ...overrides,
  }
}

describe('isChoiceVisible', () => {
  it('returns true when no requirements', () => {
    expect(isChoiceVisible(makeChoice(), makeCharacter())).toBe(true)
  })

  it('returns true when requirements is null', () => {
    expect(
      isChoiceVisible(makeChoice({ requirements: null }), makeCharacter()),
    ).toBe(true)
  })

  it('hides choice when minCorruption not met', () => {
    const character = makeCharacter({ corruption: 10 })

    expect(
      isChoiceVisible(makeChoice({}, { minCorruption: 20 }), character),
    ).toBe(false)
  })

  it('shows choice when minCorruption met', () => {
    const character = makeCharacter({ corruption: 30 })

    expect(
      isChoiceVisible(makeChoice({}, { minCorruption: 20 }), character),
    ).toBe(true)
  })

  it('hides choice when maxSanity exceeded', () => {
    const character = makeCharacter({ sanity: 80 })

    expect(isChoiceVisible(makeChoice({}, { maxSanity: 50 }), character)).toBe(
      false,
    )
  })

  it('shows choice when sanity within maxSanity', () => {
    const character = makeCharacter({ sanity: 30 })

    expect(isChoiceVisible(makeChoice({}, { maxSanity: 50 }), character)).toBe(
      true,
    )
  })

  it('hides choice when requiredFlag is missing', () => {
    const character = makeCharacter({ flags: ['flag_a'] })

    expect(
      isChoiceVisible(makeChoice({}, { requiredFlag: 'flag_b' }), character),
    ).toBe(false)
  })

  it('shows choice when requiredFlag is present', () => {
    const character = makeCharacter({ flags: ['flag_a'] })

    expect(
      isChoiceVisible(makeChoice({}, { requiredFlag: 'flag_a' }), character),
    ).toBe(true)
  })

  it('hides choice when requiredArtifact is not owned', () => {
    const character = makeCharacter({
      inventory: [
        {
          id: 'sword',
          name: 'Sword',
          rarity: 'common',
          description: 'A sword',
        },
      ],
    })

    expect(
      isChoiceVisible(
        makeChoice({}, { requiredArtifact: 'shield' }),
        character,
      ),
    ).toBe(false)
  })

  it('shows choice when requiredArtifact is owned', () => {
    const character = makeCharacter({
      inventory: [
        { id: 'mask', name: 'Mask', rarity: 'rare', description: 'A mask' },
      ],
    })

    expect(
      isChoiceVisible(makeChoice({}, { requiredArtifact: 'mask' }), character),
    ).toBe(true)
  })
})
