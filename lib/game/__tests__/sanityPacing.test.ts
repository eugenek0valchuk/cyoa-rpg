import { describe, it, expect } from 'vitest'

import { artifacts } from '../artifacts'
import {
  computeSanityAfterChoice,
  isDangerousSanityChoice,
  softenSanityDelta,
} from '../sanityPacing'
import type { Character, Choice } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 10,
  corruption: 20,
  flags: [],
}

const heavyLoss: Choice = {
  id: 'deep',
  text: 'Dive',
  effects: { sanity: -8 },
}

describe('sanityPacing', () => {
  it('caps sanity loss when vessel is already fragile', () => {
    expect(softenSanityDelta(10, -8)).toBe(-3)
    expect(softenSanityDelta(18, -8)).toBe(-5)
    expect(softenSanityDelta(40, -8)).toBe(-8)
  })

  it('leaves gains untouched', () => {
    expect(softenSanityDelta(10, 5)).toBe(5)
  })

  it('projects softened sanity after choice', () => {
    const projected = computeSanityAfterChoice(
      baseCharacter,
      heavyLoss,
      artifacts,
    )

    expect(projected).toBe(7)
  })

  it('marks choices that would leave sanity at the edge', () => {
    expect(
      isDangerousSanityChoice(baseCharacter, heavyLoss, artifacts),
    ).toBe(true)
  })
})
