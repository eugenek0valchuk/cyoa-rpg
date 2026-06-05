import { describe, it, expect } from 'vitest'

import {
  claimPendingContract,
  pickOfferedContracts,
  resolveRaidContract,
} from '../contracts'
import { createInitialHubState } from '@/lib/types/hub'

describe('pickOfferedContracts', () => {
  it('offers first threshold vow for new vessels', () => {
    const hub = { ...createInitialHubState(), totalRaids: 0, totalExtractions: 0 }
    const offered = pickOfferedContracts(hub)

    expect(offered.some((entry) => entry.id === 'vow_first_threshold')).toBe(true)
  })

  it('drops first threshold vow after many raids', () => {
    const hub = { ...createInitialHubState(), totalRaids: 5, totalExtractions: 2 }
    const offered = pickOfferedContracts(hub)

    expect(offered.some((entry) => entry.id === 'vow_first_threshold')).toBe(false)
  })
})

describe('resolveRaidContract', () => {
  it('defers reward until scribe claim when vow is fulfilled', () => {
    const hub = { ...createInitialHubState(), echo: 1 }
    const raid = { active: false, depth: 3, inventoryAtStart: [], contractId: 'vow_first_threshold' }

    const resolved = resolveRaidContract(hub, raid, {
      outcome: 'extracted',
      depth: 3,
      flags: [],
      sanityAfter: 50,
    })

    expect(resolved.result?.fulfilled).toBe(true)
    expect(resolved.result?.claimPending).toBe(true)
    expect(resolved.hub.echo).toBe(1)
    expect(resolved.hub.pendingContractClaim?.contractId).toBe('vow_first_threshold')
  })

  it('applies reward on claim', () => {
    const hub = {
      ...createInitialHubState(),
      echo: 1,
      pendingContractClaim: {
        contractId: 'vow_first_threshold',
        title: 'Первый порог',
        vow: 'test',
        rewardSummary: '+2 эхо',
      },
    }

    const claimed = claimPendingContract(hub)

    expect(claimed.hub.echo).toBe(3)
    expect(claimed.hub.pendingContractClaim).toBeNull()
    expect(claimed.rewardSummary).toContain('эхо')
  })
})
