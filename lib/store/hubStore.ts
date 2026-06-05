import { create } from 'zustand'

import {
  createInitialHubState,
  type HubState,
  type RaidState,
} from '@/lib/types/hub'
import type { Artifact } from '@/lib/types/game'

interface HubStore {
  hub: HubState | null
  raid: RaidState | null
  setHub: (hub: HubState) => void
  setRaid: (raid: RaidState | null) => void
  resetHub: () => void
  initHubForCharacter: (starterInventory: Artifact[]) => void
}

export const useHubStore = create<HubStore>((set) => ({
  hub: null,
  raid: null,

  setHub: (hub) => set({ hub }),

  setRaid: (raid) => set({ raid }),

  resetHub: () => set({ hub: null, raid: null }),

  initHubForCharacter: (starterInventory) =>
    set({
      hub: createInitialHubState(starterInventory),
      raid: null,
    }),
}))
