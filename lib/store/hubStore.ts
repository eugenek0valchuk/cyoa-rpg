import { create } from 'zustand'

import {
  createInitialHubState,
  type HubState,
  type RaidState,
} from '@/lib/types/hub'
import type { RaidSummary } from '@/lib/types/raidSummary'
import type { Artifact } from '@/lib/types/game'

interface HubStore {
  hub: HubState | null
  raid: RaidState | null
  pendingSummary: RaidSummary | null
  setHub: (hub: HubState) => void
  setRaid: (raid: RaidState | null) => void
  setPendingSummary: (summary: RaidSummary | null) => void
  resetHub: () => void
  initHubForCharacter: (starterInventory: Artifact[]) => void
}

export const useHubStore = create<HubStore>((set) => ({
  hub: null,
  raid: null,
  pendingSummary: null,

  setHub: (hub) => set({ hub }),

  setRaid: (raid) => set({ raid }),

  setPendingSummary: (pendingSummary) => set({ pendingSummary }),

  resetHub: () => set({ hub: null, raid: null, pendingSummary: null }),

  initHubForCharacter: (starterInventory) =>
    set({
      hub: createInitialHubState(starterInventory),
      raid: null,
      pendingSummary: null,
    }),
}))
