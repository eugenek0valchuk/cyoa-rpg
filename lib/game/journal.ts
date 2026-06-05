import { journalById, journalCatalog } from '@/locales/ru/journal'

import type { HubState } from '@/lib/types/hub'

export type JournalDiscoveryContext = {
  flags: string[]
  sceneIds: string[]
  endingId?: string
  unlocked: string[]
}

export function discoverJournalEntries(
  context: JournalDiscoveryContext,
): string[] {
  const found: string[] = []
  const seen = new Set(context.unlocked)

  for (const entry of journalCatalog) {
    if (seen.has(entry.id)) {
      continue
    }

    const { flag, scene, ending } = entry.unlock

    if (flag && context.flags.includes(flag)) {
      found.push(entry.id)
      continue
    }

    if (scene && context.sceneIds.includes(scene)) {
      found.push(entry.id)
      continue
    }

    if (ending && context.endingId === ending) {
      found.push(entry.id)
    }
  }

  return found
}

export function mergeJournalEntries(
  hub: HubState,
  newEntries: string[],
): HubState {
  if (newEntries.length === 0) {
    return hub
  }

  const merged = Array.from(new Set([...hub.journalEntries, ...newEntries]))

  return {
    ...hub,
    journalEntries: merged,
  }
}

export function normalizeHubState(hub: HubState): HubState {
  return {
    ...hub,
    journalEntries: hub.journalEntries ?? [],
  }
}

export function getJournalEntry(entryId: string) {
  return journalById[entryId]
}

export function sortJournalEntries(entryIds: string[]): string[] {
  const order = new Map(journalCatalog.map((entry, index) => [entry.id, index]))

  return [...entryIds].sort(
    (a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999),
  )
}
