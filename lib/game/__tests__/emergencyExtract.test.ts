import { describe, it, expect } from 'vitest'

import {
  buildEmergencyExtractSummary,
  canEmergencyExtractRaid,
  completeEmergencyExtraction,
  completeRaidExtraction,
  getEmergencyExtractBlockReason,
  getExtractBlockReason,
  partitionEmergencyLoot,
} from '../raid'
import { createInitialHubState, MIN_EXTRACT_DEPTH } from '@/lib/types/hub'
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

const activeRaid = {
  active: true,
  depth: MIN_EXTRACT_DEPTH,
  inventoryAtStart: ['ashen_faceless_mask'] as string[],
}

describe('emergency extract', () => {
  it('is available without exit site at sufficient depth', () => {
    const reason = getExtractBlockReason(activeRaid, [], 'descent')

    expect(reason).toBe('need_exit_site')
    expect(canEmergencyExtractRaid(activeRaid, reason)).toBe(true)
    expect(getEmergencyExtractBlockReason(activeRaid, reason)).toBe('available')
  })

  it('is blocked when normal extract is available', () => {
    const reason = getExtractBlockReason(activeRaid, [], 'ash_path')

    expect(reason).toBe('available')
    expect(canEmergencyExtractRaid(activeRaid, reason)).toBe(false)
    expect(getEmergencyExtractBlockReason(activeRaid, reason)).toBe(
      'exit_available',
    )
  })

  it('is blocked before minimum depth', () => {
    const shallowRaid = {
      ...activeRaid,
      depth: MIN_EXTRACT_DEPTH - 1,
    }
    const reason = getExtractBlockReason(shallowRaid, [], 'descent')

    expect(canEmergencyExtractRaid(shallowRaid, reason)).toBe(false)
    expect(getEmergencyExtractBlockReason(shallowRaid, reason)).toBe(
      'too_shallow',
    )
  })

  it('is blocked after already used', () => {
    const usedRaid = {
      ...activeRaid,
      emergencyExtractUsed: true,
    }
    const reason = getExtractBlockReason(usedRaid, [], 'descent')

    expect(canEmergencyExtractRaid(usedRaid, reason)).toBe(false)
    expect(getEmergencyExtractBlockReason(usedRaid, reason)).toBe(
      'already_used',
    )
  })

  it('keeps loadout and half of new loot', () => {
    const inventory = [
      {
        id: 'ashen_faceless_mask',
        name: 'Mask',
        description: 'd',
        rarity: 'forbidden' as const,
      },
      {
        id: 'buried_choir_candle',
        name: 'Candle',
        description: 'd',
        rarity: 'rare' as const,
      },
      {
        id: 'cursed_rosary',
        name: 'Rosary',
        description: 'd',
        rarity: 'cursed' as const,
      },
      {
        id: 'hollow_lantern',
        name: 'Lantern',
        description: 'd',
        rarity: 'common' as const,
      },
    ]

    const { kept, lost } = partitionEmergencyLoot(
      inventory,
      activeRaid.inventoryAtStart,
    )

    expect(kept.map((item) => item.id)).toEqual([
      'ashen_faceless_mask',
      'buried_choir_candle',
      'cursed_rosary',
    ])
    expect(lost.map((item) => item.id)).toEqual(['hollow_lantern'])
  })

  it('completes emergency extraction with reduced rewards', () => {
    const hub = createInitialHubState([
      {
        id: 'ashen_faceless_mask',
        name: 'Mask',
        description: 'd',
        rarity: 'forbidden',
      },
    ])

    const character = {
      ...baseCharacter,
      inventory: [
        hub.stash[0]!,
        {
          id: 'buried_choir_candle',
          name: 'Candle',
          description: 'd',
          rarity: 'rare',
        },
        {
          id: 'cursed_rosary',
          name: 'Rosary',
          description: 'd',
          rarity: 'cursed',
        },
        {
          id: 'hollow_lantern',
          name: 'Lantern',
          description: 'd',
          rarity: 'common',
        },
      ],
    }

    const emergency = completeEmergencyExtraction(character, hub, activeRaid, 4)
    const normal = completeRaidExtraction(
      character,
      hub,
      { ...activeRaid, inventoryAtStart: activeRaid.inventoryAtStart },
      4,
    )

    expect(emergency.hub.totalExtractions).toBe(1)
    expect(emergency.hub.stash).toHaveLength(3)
    expect(emergency.hub.stash.some((item) => item.id === 'hollow_lantern')).toBe(
      false,
    )
    expect(emergency.character.sanity).toBeLessThan(character.sanity)
    expect(emergency.character.corruption).toBeGreaterThan(
      normal.character.corruption,
    )
    expect((emergency.hub.echo ?? 0) < (normal.hub.echo ?? 0)).toBe(true)

    const summary = buildEmergencyExtractSummary(
      character,
      hub,
      activeRaid,
      emergency,
      4,
    )

    expect(summary.outcome).toBe('emergency_extracted')
    expect(summary.gainedArtifacts).toHaveLength(2)
    expect(summary.lostArtifacts).toHaveLength(1)
  })
})
