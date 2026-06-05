import { describe, expect, it } from 'vitest'

import {
  addFolioFragment,
  addHubMaterials,
  canUpgradeBuilding,
  solveFolioPuzzle,
  syncFolioFragments,
  upgradeBuilding,
} from '@/lib/game/hubWorkshop'
import { createInitialHubState } from '@/lib/types/hub'

describe('hubWorkshop', () => {
  it('upgrades lamp when materials are available', () => {
    let hub = addHubMaterials(createInitialHubState(), { iron_shard: 2 })
    expect(canUpgradeBuilding(hub, 'chamber_lamp')).toBe(true)

    hub = upgradeBuilding(hub, 'chamber_lamp')!
    expect(hub.buildings?.chamber_lamp).toBe(1)
    expect(hub.workshopSanityBonus).toBe(3)
  })

  it('solves folio puzzle with correct answer', () => {
    let hub = createInitialHubState()
    for (let i = 0; i < 3; i += 1) {
      hub = addFolioFragment(hub).hub
    }

    const result = solveFolioPuzzle(hub, 'machine_witness')

    expect(result.correct).toBe(true)
    expect(result.hub.folioPuzzleSolved).toBe(true)
    expect(result.hub.folioFragments).toEqual([])
    expect(result.hub.journalEntries).toContain('mystery_folio')
    expect(result.hub.echo).toBe(4)
  })

  it('syncs folio fragments from legacy material count', () => {
    const hub = addHubMaterials(createInitialHubState(), { folio_page: 2 })
    const synced = syncFolioFragments(hub)

    expect(synced.folioFragments).toEqual(['folio_a', 'folio_b'])
  })
})
