import { describe, expect, it } from 'vitest'

import { artifacts } from '@/locales/ru/artifacts'
import {
  applyArtifactPickupEffects,
  applyLoadoutPassiveEffects,
  getArtifactEffectLines,
  getArtifactImageSrc,
  sumArtifactEffects,
} from '../artifactEffects'

const baseCharacter = {
  name: 'Test',
  origin: 'witness' as const,
  stats: { strength: 10, agility: 10, intelligence: 10 },
  inventory: [],
  sanity: 50,
  corruption: 10,
  flags: [],
}

describe('artifactEffects', () => {
  it('returns image path for each catalog artifact', () => {
    for (const artifact of Object.values(artifacts)) {
      expect(getArtifactImageSrc(artifact)).toMatch(/^\/artifacts\//)
    }
  })

  it('sums passive effects from loadout', () => {
    const mask = artifacts.ashen_faceless_mask
    const total = sumArtifactEffects([mask])

    expect(total.sanity).toBe(-4)
    expect(total.corruption).toBe(3)
  })

  it('applies loadout passive at raid start', () => {
    const mask = artifacts.ashen_faceless_mask
    const next = applyLoadoutPassiveEffects(baseCharacter, [mask])

    expect(next.sanity).toBe(46)
    expect(next.corruption).toBe(13)
  })

  it('applies onAcquire and passive on pickup', () => {
    const mask = artifacts.ashen_faceless_mask
    const next = applyArtifactPickupEffects(baseCharacter, mask)

    expect(next.sanity).toBe(44)
    expect(next.corruption).toBe(14)
  })

  it('lists stat effect lines for UI', () => {
    const lines = getArtifactEffectLines(artifacts.black_vertebrae.effects)

    expect(lines.some((line) => line.key === 'strength' && line.delta === 1)).toBe(
      true,
    )
  })
})
