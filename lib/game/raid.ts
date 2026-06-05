import { getInitialScene } from './getInitialScene'
import type { Artifact, Character } from '@/lib/types/game'
import type { HubState, RaidState } from '@/lib/types/hub'

export {
  canExtractRaid,
  getExtractBlockReason,
  hasReturnSigil,
  RETURN_SIGIL_FLAG,
  EXTRACTION_SITES,
  SIGIL_EXTRACTION_SITES,
} from './extraction'
export type { ExtractBlockReason } from './extraction'

export function getRaidDepth(sceneHistoryLength: number): number {
  return sceneHistoryLength
}

export function startRaidFromHub(
  character: Character,
  hub: HubState,
  loadout: Artifact[],
): { character: Character; hub: HubState; raid: RaidState } {
  return {
    character: {
      ...character,
      inventory: loadout.map((item) => ({ ...item })),
      sanity: 100,
      flags: [],
    },
    hub: {
      ...hub,
      totalRaids: hub.totalRaids + 1,
    },
    raid: {
      active: true,
      depth: 0,
      inventoryAtStart: loadout.map((item) => item.id),
    },
  }
}

function mergeIntoStash(stash: Artifact[], gained: Artifact[]): Artifact[] {
  const result = [...stash]

  for (const item of gained) {
    if (!result.some((entry) => entry.id === item.id)) {
      result.push({ ...item })
    }
  }

  return result
}

function calcRoomLevel(bestDepth: number, extractions: number): number {
  if (extractions >= 5 || bestDepth >= 10) {
    return 3
  }

  if (extractions >= 2 || bestDepth >= 6) {
    return 2
  }

  if (extractions >= 1 || bestDepth >= 3) {
    return 1
  }

  return 0
}

export function completeRaidExtraction(
  character: Character,
  hub: HubState,
  raid: RaidState,
  depth: number,
): { character: Character; hub: HubState; raid: null } {
  const gained = character.inventory.filter(
    (item) => !raid.inventoryAtStart.includes(item.id),
  )

  const bestDepth = Math.max(hub.bestDepth, depth)
  const totalExtractions = hub.totalExtractions + 1
  const roomLevel = calcRoomLevel(bestDepth, totalExtractions)

  const roomMarks = [...hub.roomMarks]

  if (depth >= 6 && !roomMarks.includes('deep_echo')) {
    roomMarks.push('deep_echo')
  }

  if (gained.length > 0 && !roomMarks.includes('first_spoils')) {
    roomMarks.push('first_spoils')
  }

  const stash = mergeIntoStash(hub.stash, character.inventory)

  return {
    character: {
      ...character,
      inventory: [],
      sanity: Math.min(100, character.sanity + 15),
    },
    hub: {
      ...hub,
      stash,
      bestDepth,
      totalExtractions,
      roomLevel,
      roomMarks,
    },
    raid: null,
  }
}

export function failRaid(
  character: Character,
  hub: HubState,
  raid: RaidState,
  depth: number,
): { character: Character; hub: HubState; raid: null } {
  const keptLoadout = hub.stash.filter((item) =>
    raid.inventoryAtStart.includes(item.id),
  )

  const roomMarks = [...hub.roomMarks]

  if (!roomMarks.includes('failure_stain')) {
    roomMarks.push('failure_stain')
  }

  if (depth >= 5 && !roomMarks.includes('deep_wound')) {
    roomMarks.push('deep_wound')
  }

  return {
    character: {
      ...character,
      inventory: [],
      sanity: Math.max(20, Math.floor(character.sanity * 0.5)),
    },
    hub: {
      ...hub,
      bestDepth: Math.max(hub.bestDepth, depth),
      roomMarks,
    },
    raid: null,
  }
}

export function getRaidStartScene() {
  return getInitialScene()
}
