import { describe, it, expect } from 'vitest'

import { pickOfferedContracts } from '../contracts'
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
