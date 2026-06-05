import { discoverJournalEntries, mergeJournalEntries } from './journal'

import type { HubState } from '@/lib/types/hub'

export function applyJournalDiscovery(
  hub: HubState,
  context: {
    flags: string[]
    sceneIds: string[]
    endingId?: string
  },
): { hub: HubState; newEntries: string[] } {
  const newEntries = discoverJournalEntries({
    flags: context.flags,
    sceneIds: context.sceneIds,
    endingId: context.endingId,
    unlocked: hub.journalEntries,
  })

  if (newEntries.length === 0) {
    return { hub, newEntries: [] }
  }

  return {
    hub: mergeJournalEntries(hub, newEntries),
    newEntries,
  }
}
