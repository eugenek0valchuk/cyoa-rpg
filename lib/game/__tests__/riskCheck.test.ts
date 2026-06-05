import { describe, it, expect } from 'vitest'

import {
  computeRiskChance,
  computeRiskDc,
  getRiskOffer,
  rollRiskCheck,
} from '../riskCheck'

import type { Character, Choice } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 4, agility: 4, intelligence: 4 },
  inventory: [],
  sanity: 80,
  corruption: 10,
  flags: [],
}

function makeChoice(requirements: Choice['requirements']): Choice {
  return {
    id: 'test',
    text: 'Try',
    requirements,
  }
}

describe('riskCheck', () => {
  it('computes DC from requirement', () => {
    expect(computeRiskDc(6)).toBe(14)
  })

  it('offers risk when only intelligence blocks', () => {
    const offer = getRiskOffer(
      makeChoice({ intelligence: 6 }),
      baseCharacter,
    )

    expect(offer).toMatchObject({
      stat: 'intelligence',
      need: 6,
      have: 4,
      dc: 14,
    })
  })

  it('does not offer risk when stat is sufficient', () => {
    const offer = getRiskOffer(
      makeChoice({ intelligence: 3 }),
      baseCharacter,
    )

    expect(offer).toBeNull()
  })

  it('does not offer risk for non-stat blocks', () => {
    const offer = getRiskOffer(
      makeChoice({ intelligence: 6, requiredFlag: 'missing' }),
      baseCharacter,
    )

    expect(offer).toBeNull()
  })

  it('auto-success on natural 20', () => {
    const result = rollRiskCheck(0, 30, () => 0.95)

    expect(result.roll).toBe(20)
    expect(result.success).toBe(true)
    expect(result.criticalSuccess).toBe(true)
  })

  it('auto-failure on natural 1', () => {
    const result = rollRiskCheck(10, 5, () => 0)

    expect(result.roll).toBe(1)
    expect(result.success).toBe(false)
    expect(result.criticalFailure).toBe(true)
  })

  it('estimates chance for underpowered roll', () => {
    expect(computeRiskChance(4, 15)).toBe(50)
  })
})
