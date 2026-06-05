import { describe, it, expect } from 'vitest'

import { buildDirectorState, getStoryPhase } from '../director'
import type { Character } from '@/lib/types/game'

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    name: 'Test',
    origin: 'hollow',
    stats: { strength: 5, agility: 5, intelligence: 5 },
    inventory: [],
    sanity: 50,
    corruption: 50,
    flags: [],
    ...overrides,
  }
}

describe('director', () => {
  it('does not open collapse phase at raid start despite high corruption', () => {
    expect(getStoryPhase(85, 0)).toBe('COMMUNION')
    expect(getStoryPhase(85, 4)).toBe('COLLAPSE')
  })

  it('does not force collapse ending state before the raid has depth', () => {
    const state = buildDirectorState(
      makeCharacter({ corruption: 85, sanity: 9 }),
      [],
    )

    expect(state.phase).toBe('COMMUNION')
    expect(state.forceEnding).toBe(false)
  })

  it('forces ending only when sanity is critically low or corruption peaks', () => {
    expect(
      buildDirectorState(makeCharacter({ corruption: 85, sanity: 4 }), [])
        .forceEnding,
    ).toBe(true)
    expect(
      buildDirectorState(makeCharacter({ corruption: 95, sanity: 40 }), [])
        .forceEnding,
    ).toBe(true)
  })
})
