import type { Artifact } from './game'

export interface HubState {
  roomLevel: number
  roomMarks: string[]
  stash: Artifact[]
  totalRaids: number
  totalExtractions: number
  bestDepth: number
  loadoutSlots: number
}

export interface RaidState {
  active: boolean
  depth: number
  inventoryAtStart: string[]
}

export const MIN_EXTRACT_DEPTH = 2
export const DEFAULT_LOADOUT_SLOTS = 2

export function createInitialHubState(
  starterInventory: Artifact[] = [],
): HubState {
  return {
    roomLevel: 0,
    roomMarks: [],
    stash: [...starterInventory],
    totalRaids: 0,
    totalExtractions: 0,
    bestDepth: 0,
    loadoutSlots: DEFAULT_LOADOUT_SLOTS,
  }
}
