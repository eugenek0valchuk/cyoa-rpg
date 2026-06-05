import { describe, it, expect } from 'vitest'

import {
  canExtractRaid,
  completeRaidExtraction,
  failRaid,
  getExtractBlockReason,
  RETURN_SIGIL_FLAG,
  startRaidFromHub,
} from '../raid'
import { createInitialHubState, MIN_EXTRACT_DEPTH } from '@/lib/types/hub'
import type { Character } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 40,
  corruption: 30,
  flags: ['old_flag'],
}

const activeRaid = {
  active: true,
  depth: MIN_EXTRACT_DEPTH,
  inventoryAtStart: [] as string[],
}

describe('raid system', () => {
  it('starts raid with selected loadout and fresh sanity', () => {
    const hub = createInitialHubState([
      {
        id: 'ashen_faceless_mask',
        name: 'Mask',
        description: 'd',
        rarity: 'forbidden',
      },
    ])

    const result = startRaidFromHub(baseCharacter, hub, hub.stash)

    expect(result.raid.active).toBe(true)
    expect(result.character.inventory).toHaveLength(1)
    expect(result.character.sanity).toBe(100)
    expect(result.character.flags).toEqual([])
    expect(result.hub.totalRaids).toBe(1)
  })

  it('blocks extraction without exit site or return sigil', () => {
    expect(
      canExtractRaid(activeRaid, [], 'descent'),
    ).toBe(false)
    expect(
      getExtractBlockReason(activeRaid, [], 'descent'),
    ).toBe('need_exit_site')
  })

  it('blocks extraction before minimum depth even at exit site', () => {
    const shallowRaid = {
      ...activeRaid,
      depth: MIN_EXTRACT_DEPTH - 1,
    }

    expect(
      canExtractRaid(shallowRaid, [], 'ash_path'),
    ).toBe(false)
    expect(
      getExtractBlockReason(shallowRaid, [], 'ash_path'),
    ).toBe('need_depth')
  })

  it('allows extraction at dedicated exit sites', () => {
    expect(canExtractRaid(activeRaid, [], 'ash_path')).toBe(true)
    expect(canExtractRaid(activeRaid, [], 'exit_monastery')).toBe(true)
    expect(canExtractRaid(activeRaid, [], 'drain_water')).toBe(true)
  })

  it('allows extraction at surface sites with return sigil', () => {
    const flags = [RETURN_SIGIL_FLAG]

    expect(canExtractRaid(activeRaid, flags, 'mouth')).toBe(true)
    expect(canExtractRaid(activeRaid, flags, 'leave_cart')).toBe(true)
    expect(canExtractRaid(activeRaid, [], 'mouth')).toBe(false)
    expect(getExtractBlockReason(activeRaid, flags, 'descent')).toBe(
      'need_sigil_site',
    )
  })

  it('keeps loot on successful extraction', () => {
    const hub = createInitialHubState([])
    const raid = { active: true, depth: 3, inventoryAtStart: [] as string[] }
    const character = {
      ...baseCharacter,
      inventory: [
        {
          id: 'buried_choir_candle',
          name: 'Candle',
          description: 'd',
          rarity: 'rare',
        },
      ],
    }

    const result = completeRaidExtraction(character, hub, raid, 3)

    expect(result.hub.stash).toHaveLength(1)
    expect(result.character.inventory).toHaveLength(0)
    expect(result.hub.totalExtractions).toBe(1)
    expect(result.raid).toBeNull()
  })

  it('loses new loot on failed raid', () => {
    const hub = createInitialHubState([
      {
        id: 'ashen_faceless_mask',
        name: 'Mask',
        description: 'd',
        rarity: 'forbidden',
      },
    ])

    const raid = {
      active: true,
      depth: 4,
      inventoryAtStart: ['ashen_faceless_mask'],
    }

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
      ],
      sanity: 0,
    }

    const result = failRaid(character, hub, raid, 4)

    expect(result.hub.stash).toHaveLength(1)
    expect(result.hub.stash[0]?.id).toBe('ashen_faceless_mask')
    expect(result.hub.roomMarks).toContain('failure_stain')
    expect(result.raid).toBeNull()
  })
})
