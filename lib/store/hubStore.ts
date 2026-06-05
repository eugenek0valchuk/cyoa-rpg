import { create } from 'zustand'

import {
  createInitialHubState,
  type HubState,
  type RaidState,
} from '@/lib/types/hub'
import type { HubToastItem } from '@/components/ui/HubToast'
import type { RaidSummary } from '@/lib/types/raidSummary'
import type { Artifact } from '@/lib/types/game'

interface HubStore {
  hub: HubState | null
  raid: RaidState | null
  pendingSummary: RaidSummary | null
  pendingToasts: HubToastItem[]
  setHub: (hub: HubState) => void
  setRaid: (raid: RaidState | null) => void
  setPendingSummary: (summary: RaidSummary | null) => void
  pushPendingToasts: (items: HubToastItem[]) => void
  shiftPendingToasts: () => HubToastItem[]
  resetHub: () => void
  initHubForCharacter: (starterInventory: Artifact[]) => void
}

export const useHubStore = create<HubStore>((set) => ({
  hub: null,
  raid: null,
  pendingSummary: null,
  pendingToasts: [],

  setHub: (hub) => set({ hub }),

  setRaid: (raid) => set({ raid }),

  setPendingSummary: (pendingSummary) => set({ pendingSummary }),

  pushPendingToasts: (items) =>
    set((state) => ({
      pendingToasts: [...state.pendingToasts, ...items],
    })),

  shiftPendingToasts: () => {
    let drained: HubToastItem[] = []
    set((state) => {
      drained = state.pendingToasts
      return { pendingToasts: [] }
    })
    return drained
  },

  resetHub: () =>
    set({ hub: null, raid: null, pendingSummary: null, pendingToasts: [] }),

  initHubForCharacter: (starterInventory) =>
    set({
      hub: createInitialHubState(starterInventory),
      raid: null,
      pendingSummary: null,
    }),
}))
