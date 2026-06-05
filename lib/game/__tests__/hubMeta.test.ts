import { describe, it, expect } from 'vitest'

import {
  applyRaidStartSanity,
  calcEchoFromExtraction,
  getLoadoutSlotsForRoomLevel,
  getRaidStartSanityDelta,
  restVesselAfterFailedRaid,
  spendEcho,
  syncHubProgression,
} from '../hubMeta'
import { completeRaidExtraction, startRaidFromHub } from '../raid'
import { applyRaidModifierTick } from '../raidModifiers'
import { createInitialHubState } from '@/lib/types/hub'
import type { Character } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 70,
  corruption: 10,
  flags: [],
}

describe('hubMeta', () => {
  it('stacks mark penalties on raid start sanity', () => {
    expect(
      getRaidStartSanityDelta(['failure_stain', 'deep_wound']),
    ).toBe(-7)
    expect(
      applyRaidStartSanity(70, ['failure_stain', 'deep_wound']),
    ).toBe(63)
  })

  it('scales loadout slots with room level', () => {
    expect(getLoadoutSlotsForRoomLevel(0)).toBe(2)
    expect(getLoadoutSlotsForRoomLevel(2)).toBe(3)
    expect(getLoadoutSlotsForRoomLevel(3)).toBe(4)
  })

  it('syncs loadout slots after progression', () => {
    const hub = syncHubProgression({
      ...createInitialHubState(),
      roomLevel: 2,
      loadoutSlots: 2,
    })

    expect(hub.loadoutSlots).toBe(3)
  })

  it('awards echo on extraction by depth and loot', () => {
    expect(calcEchoFromExtraction(4, 1, [])).toBe(5)
    expect(calcEchoFromExtraction(6, 0, ['deep_echo', 'first_spoils'])).toBe(10)
  })

  it('applies deep echo drain on modifier ticks', () => {
    const after = applyRaidModifierTick(
      baseCharacter,
      'muted_bells',
      ['deep_echo'],
    )

    expect(after.sanity).toBe(68)
  })

  it('restores minimum hub sanity after failed raid', () => {
    const rested = restVesselAfterFailedRaid({ sanity: 0, corruption: 90 })

    expect(rested.sanity).toBe(32)
    expect(rested.corruption).toBe(80)
  })

  it('clamps raid start sanity to playable floor', () => {
    expect(applyRaidStartSanity(15, ['failure_stain', 'deep_wound'])).toBe(12)
  })

  it('starts raid with reduced sanity from room marks', () => {
    const hub = {
      ...createInitialHubState(),
      roomMarks: ['deep_echo'],
    }

    const started = startRaidFromHub(baseCharacter, hub, [])

    expect(started.character.sanity).toBe(65)
  })

  it('adds echo to hub after successful extraction', () => {
    const hub = createInitialHubState()
    const raid = { active: true, depth: 4, inventoryAtStart: [] as string[] }
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

    const result = completeRaidExtraction(character, hub, raid, 4)

    expect(result.hub.echo).toBeGreaterThan(0)
    expect(result.hub.loadoutSlots).toBe(2)
  })

  it('spends echo for rerolls', () => {
    const hub = { ...createInitialHubState(), echo: 2 }
    const spent = spendEcho(hub, 1)

    expect(spent?.echo).toBe(1)
    expect(spendEcho(hub, 5)).toBeNull()
  })
})
