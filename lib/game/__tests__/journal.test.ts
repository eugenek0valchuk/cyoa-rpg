import { describe, it, expect } from 'vitest'

import { applyJournalDiscovery } from '../applyJournalDiscovery'
import { discoverJournalEntries } from '../journal'
import { createInitialHubState } from '@/lib/types/hub'

describe('journal discovery', () => {
  it('unlocks diary intro on start scene', () => {
    const found = discoverJournalEntries({
      flags: [],
      sceneIds: ['start'],
      unlocked: [],
    })

    expect(found).toContain('diary_awakening')
  })

  it('unlocks npc entry from flag', () => {
    const found = discoverJournalEntries({
      flags: ['synod_mark'],
      sceneIds: [],
      unlocked: [],
    })

    expect(found).toContain('npc_synod')
  })

  it('does not duplicate unlocked entries', () => {
    const hub = createInitialHubState()
    const first = applyJournalDiscovery(hub, {
      flags: ['synod_mark'],
      sceneIds: ['start'],
    })

    const second = applyJournalDiscovery(first.hub, {
      flags: ['synod_mark'],
      sceneIds: ['start'],
    })

    expect(second.newEntries).toHaveLength(0)
    expect(second.hub.journalEntries.filter((id) => id === 'npc_synod')).toHaveLength(1)
  })

  it('unlocks ending entry', () => {
    const found = discoverJournalEntries({
      flags: [],
      sceneIds: [],
      endingId: 'reality_collapse',
      unlocked: [],
    })

    expect(found).toContain('ending_collapse')
  })
})
