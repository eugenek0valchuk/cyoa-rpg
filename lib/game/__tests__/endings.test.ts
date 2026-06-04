import { describe, it, expect } from 'vitest'

import { getEnding } from '../endings'
import type { Character } from '@/lib/types/game'

const baseContext = {
  historyLength: 5,
  phase: 'DESCENT' as const,
  forceEnding: false,
}

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

describe('getEnding', () => {
  it('returns abyssal_ascension when corruption >= 100', () => {
    const result = getEnding(makeCharacter({ corruption: 100 }), baseContext)

    expect(result?.id).toBe('abyssal_ascension')
  })

  it('returns madness when sanity <= 0', () => {
    const result = getEnding(makeCharacter({ sanity: 0 }), baseContext)

    expect(result?.id).toBe('madness')
  })

  it('returns null for normal stats', () => {
    const result = getEnding(makeCharacter(), baseContext)

    expect(result).toBeNull()
  })

  it('prefers corruption ending over sanity ending', () => {
    const result = getEnding(
      makeCharacter({ sanity: 0, corruption: 100 }),
      baseContext,
    )

    expect(result?.id).toBe('abyssal_ascension')
  })

  it('returns bell_witness for witness with bell flag under pressure', () => {
    const result = getEnding(
      makeCharacter({
        origin: 'witness',
        corruption: 75,
        flags: ['heard_the_bell'],
      }),
      { ...baseContext, forceEnding: true },
    )

    expect(result?.id).toBe('bell_witness')
  })

  it('returns hollow_merge when mask claimed and corruption is high', () => {
    const result = getEnding(
      makeCharacter({
        corruption: 85,
        flags: ['claimed_mask'],
      }),
      baseContext,
    )

    expect(result?.id).toBe('hollow_merge')
  })

  it('returns silent_departure for long low-corruption run', () => {
    const result = getEnding(
      makeCharacter({
        sanity: 80,
        corruption: 15,
        flags: ['ash_path_taken'],
      }),
      { ...baseContext, historyLength: 12 },
    )

    expect(result?.id).toBe('silent_departure')
  })

  it('returns reality_collapse when director forces ending in collapse phase', () => {
    const result = getEnding(
      makeCharacter({ corruption: 85, sanity: 15 }),
      {
        historyLength: 10,
        phase: 'COLLAPSE',
        forceEnding: true,
      },
    )

    expect(result?.id).toBe('reality_collapse')
  })
})
