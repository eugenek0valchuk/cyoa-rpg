import { describe, expect, it } from 'vitest'

import { isHubMerchantUnlocked } from '../merchant'
import { completeRaidExtraction, startRaidFromHub } from '../raid'
import { createInitialHubState } from '@/lib/types/hub'
import type { Character } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Альян',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 100,
  corruption: 0,
  flags: [],
}

describe('raid loop on one vessel', () => {
  it('completes four start → extract cycles with progression', () => {
    let hub = createInitialHubState()
    let character: Character = { ...baseCharacter }

    for (let run = 1; run <= 4; run += 1) {
      const started = startRaidFromHub(character, hub, [])
      character = started.character
      hub = started.hub

      expect(hub.totalRaids).toBe(run)
      expect(started.raid.active).toBe(true)
      expect(started.raid.prologueSeen).toBe(false)

      const depth = 2 + run
      const extracted = completeRaidExtraction(
        character,
        hub,
        started.raid,
        depth,
      )

      character = extracted.character
      hub = extracted.hub

      expect(extracted.raid).toBeNull()
      expect(hub.totalExtractions).toBe(run)
      expect(hub.bestDepth).toBeGreaterThanOrEqual(depth)
    }

    expect(hub.totalRaids).toBe(4)
    expect(hub.totalExtractions).toBe(4)
    expect(hub.roomLevel).toBeGreaterThanOrEqual(1)
    expect(hub.echo).toBeGreaterThan(0)
    expect(hub.loadoutSlots).toBeGreaterThanOrEqual(2)
  })

  it('unlocks hub merchant after first extraction', () => {
    let hub = createInitialHubState()
    let character: Character = { ...baseCharacter }

    expect(isHubMerchantUnlocked(hub)).toBe(false)

    const started = startRaidFromHub(character, hub, [])
    const extracted = completeRaidExtraction(
      started.character,
      started.hub,
      started.raid,
      4,
    )

    hub = extracted.hub
    expect(isHubMerchantUnlocked(hub)).toBe(true)
  })

  it('resets raid flags and prologue between runs', () => {
    let hub = createInitialHubState()
    let character: Character = { ...baseCharacter }

    for (let run = 0; run < 2; run += 1) {
      const started = startRaidFromHub(character, hub, [])
      expect(started.raid.prologueSeen).toBe(false)

      const extracted = completeRaidExtraction(
        started.character,
        started.hub,
        started.raid,
        3,
      )

      character = extracted.character
      hub = extracted.hub
      expect(extracted.raid).toBeNull()
    }

    expect(hub.totalRaids).toBe(2)
    expect(hub.totalExtractions).toBe(2)
  })
})
