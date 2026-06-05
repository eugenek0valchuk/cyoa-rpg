import { getInitialScene } from './getInitialScene'
import { getContractEncounterBoostFlag, resolveRaidContract, type ContractResult } from './contracts'
import { appendRaidLog } from './raidLog'
import { calcEchoFromExtraction, applyRaidStartSanity, restVesselAfterFailedRaid, syncHubProgression } from './hubMeta'
import type { RaidModifierId } from './raidModifiers'
import type { Artifact, Character } from '@/lib/types/game'
import type { HubState, RaidState } from '@/lib/types/hub'
import type { RaidSummary, RaidOutcome } from '@/lib/types/raidSummary'

export {
  canExtractRaid,
  canEmergencyExtractRaid,
  getExtractBlockReason,
  getEmergencyExtractBlockReason,
  getExitSiteConditionValues,
  hasReturnSigil,
  isAtExtractionSite,
  RETURN_SIGIL_FLAG,
  EXTRACTION_SITES,
  SIGIL_EXTRACTION_SITES,
  EXIT_SITE_CONDITIONS,
} from './extraction'
export type {
  ExtractBlockReason,
  EmergencyExtractBlockReason,
} from './extraction'
export type { ContractResult } from './contracts'

export const EMERGENCY_EXTRACT_SANITY_COST = 12
export const EMERGENCY_EXTRACT_CORRUPTION = 3
export const EMERGENCY_EXTRACT_ECHO_FACTOR = 0.5

export function getRaidDepth(sceneHistoryLength: number): number {
  return sceneHistoryLength
}

export function partitionEmergencyLoot(
  inventory: Artifact[],
  inventoryAtStart: string[],
): { kept: Artifact[]; lost: Artifact[] } {
  const loadout = inventory.filter((item) =>
    inventoryAtStart.includes(item.id),
  )
  const newLoot = inventory.filter(
    (item) => !inventoryAtStart.includes(item.id),
  )
  const keepCount = Math.ceil(newLoot.length / 2)

  return {
    kept: [...loadout, ...newLoot.slice(0, keepCount)],
    lost: newLoot.slice(keepCount),
  }
}

export function startRaidFromHub(
  character: Character,
  hub: HubState,
  loadout: Artifact[],
  modifierId: RaidModifierId | null = null,
  contractId: string | null = null,
): { character: Character; hub: HubState; raid: RaidState } {
  const boostFlag = getContractEncounterBoostFlag(
    hub.pendingEncounterBoost ?? null,
  )
  const raidFlags = boostFlag ? [boostFlag] : []

  return {
    character: {
      ...character,
      inventory: loadout.map((item) => ({ ...item })),
      flags: raidFlags,
      sanity: applyRaidStartSanity(
        character.sanity,
        hub.roomMarks,
        hub.nextRaidSanityBonus ?? 0,
      ),
    },
    hub: {
      ...hub,
      totalRaids: hub.totalRaids + 1,
      pendingEncounterBoost: null,
      nextRaidSanityBonus: 0,
    },
    raid: {
      active: true,
      depth: 0,
      inventoryAtStart: loadout.map((item) => item.id),
      modifierId,
      contractId,
      prologueSeen: false,
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

export function completeEmergencyExtraction(
  character: Character,
  hub: HubState,
  raid: RaidState,
  depth: number,
): { character: Character; hub: HubState; raid: null } {
  const { kept, lost } = partitionEmergencyLoot(
    character.inventory,
    raid.inventoryAtStart,
  )

  const bestDepth = Math.max(hub.bestDepth, depth)
  const totalExtractions = hub.totalExtractions + 1
  const roomLevel = calcRoomLevel(bestDepth, totalExtractions)
  const roomMarks = [...hub.roomMarks]

  if (depth >= 6 && !roomMarks.includes('deep_echo')) {
    roomMarks.push('deep_echo')
  }

  if (kept.some((item) => !raid.inventoryAtStart.includes(item.id))) {
    if (!roomMarks.includes('first_spoils')) {
      roomMarks.push('first_spoils')
    }
  }

  const gainedCount = kept.filter(
    (item) => !raid.inventoryAtStart.includes(item.id),
  ).length

  const stash = mergeIntoStash(hub.stash, kept)
  const rawEcho = calcEchoFromExtraction(depth, gainedCount, roomMarks)
  const echoGain = Math.max(
    1,
    Math.floor(rawEcho * EMERGENCY_EXTRACT_ECHO_FACTOR),
  )

  const hubAfter = syncHubProgression({
    ...hub,
    stash,
    bestDepth,
    totalExtractions,
    roomLevel,
    roomMarks,
    echo: (hub.echo ?? 0) + echoGain,
  })

  return {
    character: {
      ...character,
      inventory: [],
      sanity: Math.max(
        0,
        Math.min(100, character.sanity - EMERGENCY_EXTRACT_SANITY_COST),
      ),
      corruption: Math.min(
        100,
        character.corruption + EMERGENCY_EXTRACT_CORRUPTION,
      ),
    },
    hub: appendRaidLog(hubAfter, {
      outcome: 'emergency_extracted',
      depth,
      echoGain,
    }),
    raid: null,
  }
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
  const echoGain = calcEchoFromExtraction(depth, gained.length, roomMarks)

  const hubAfter = syncHubProgression({
    ...hub,
    stash,
    bestDepth,
    totalExtractions,
    roomLevel,
    roomMarks,
    echo: (hub.echo ?? 0) + echoGain,
  })

  return {
    character: {
      ...character,
      inventory: [],
      sanity: Math.min(100, character.sanity + 15),
    },
    hub: appendRaidLog(hubAfter, {
      outcome: 'extracted',
      depth,
      echoGain,
    }),
    raid: null,
  }
}

export function failRaid(
  character: Character,
  hub: HubState,
  raid: RaidState,
  depth: number,
  outcome: 'failed' | 'abandoned' = 'failed',
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

  const rested = restVesselAfterFailedRaid(character)

  const hubAfter = {
    ...hub,
    bestDepth: Math.max(hub.bestDepth, depth),
    roomMarks,
  }

  return {
    character: {
      ...character,
      inventory: [],
      sanity: rested.sanity,
      corruption: rested.corruption,
    },
    hub: appendRaidLog(hubAfter, { outcome, depth }),
    raid: null,
  }
}

export function getRaidStartScene(
  character?: Character,
  journalEntries: string[] = [],
) {
  return getInitialScene(character, journalEntries)
}

function diffNewMarks(before: string[], after: string[]): string[] {
  return after.filter((mark) => !before.includes(mark))
}

export function applyContractToRaidEnd(
  hub: HubState,
  raid: RaidState,
  context: {
    outcome: RaidOutcome
    depth: number
    flags: string[]
    sanityAfter: number
    extractSceneId?: string
  },
): { hub: HubState; contractResult: ContractResult | null } {
  const resolved = resolveRaidContract(hub, raid, context)
  return { hub: resolved.hub, contractResult: resolved.result }
}

function attachContractToSummary(
  summary: RaidSummary,
  hubBefore: HubState,
  hubAfter: HubState,
  contractResult: ContractResult | null,
): RaidSummary {
  if (!contractResult) {
    return summary
  }

  return {
    ...summary,
    echoAfter: hubAfter.echo ?? 0,
    echoGain: (hubAfter.echo ?? 0) - (hubBefore.echo ?? 0),
    contractTitle: contractResult.title,
    contractFulfilled: contractResult.fulfilled,
    contractReward: contractResult.fulfilled
      ? contractResult.rewardSummary
      : undefined,
    contractClaimPending: contractResult.claimPending,
  }
}

export function buildEmergencyExtractSummary(
  characterBefore: Character,
  hubBefore: HubState,
  raid: RaidState,
  result: ReturnType<typeof completeEmergencyExtraction>,
  depth: number,
  contractResult: ContractResult | null = null,
  hubAfterContract?: HubState,
): RaidSummary {
  const { kept, lost } = partitionEmergencyLoot(
    characterBefore.inventory,
    raid.inventoryAtStart,
  )
  const gainedArtifacts = kept.filter(
    (item) => !raid.inventoryAtStart.includes(item.id),
  )
  const finalHub = hubAfterContract ?? result.hub
  const echoGain = (finalHub.echo ?? 0) - (hubBefore.echo ?? 0)

  const summary: RaidSummary = {
    outcome: 'emergency_extracted',
    depth,
    gainedArtifacts,
    lostArtifacts: lost,
    newMarks: diffNewMarks(hubBefore.roomMarks, result.hub.roomMarks),
    sanityBefore: characterBefore.sanity,
    sanityAfter: result.character.sanity,
    roomLevelAfter: finalHub.roomLevel,
    bestDepthAfter: finalHub.bestDepth,
    totalExtractionsAfter: finalHub.totalExtractions,
    echoGain,
    echoAfter: finalHub.echo ?? 0,
  }

  return attachContractToSummary(
    summary,
    hubBefore,
    finalHub,
    contractResult,
  )
}

export function buildExtractSummary(
  characterBefore: Character,
  hubBefore: HubState,
  raid: RaidState,
  result: ReturnType<typeof completeRaidExtraction>,
  depth: number,
  contractResult: ContractResult | null = null,
  hubAfterContract?: HubState,
): RaidSummary {
  const gainedArtifacts = characterBefore.inventory.filter(
    (item) => !raid.inventoryAtStart.includes(item.id),
  )
  const finalHub = hubAfterContract ?? result.hub
  const echoGain = (finalHub.echo ?? 0) - (hubBefore.echo ?? 0)

  const summary: RaidSummary = {
    outcome: 'extracted',
    depth,
    gainedArtifacts,
    lostArtifacts: [],
    newMarks: diffNewMarks(hubBefore.roomMarks, result.hub.roomMarks),
    sanityBefore: characterBefore.sanity,
    sanityAfter: result.character.sanity,
    roomLevelAfter: finalHub.roomLevel,
    bestDepthAfter: finalHub.bestDepth,
    totalExtractionsAfter: finalHub.totalExtractions,
    echoGain,
    echoAfter: finalHub.echo ?? 0,
  }

  return attachContractToSummary(
    summary,
    hubBefore,
    finalHub,
    contractResult,
  )
}

export function buildFailSummary(
  characterBefore: Character,
  hubBefore: HubState,
  raid: RaidState,
  result: ReturnType<typeof failRaid>,
  depth: number,
  contractResult: ContractResult | null = null,
  hubAfterContract?: HubState,
): RaidSummary {
  const lostArtifacts = characterBefore.inventory.filter(
    (item) => !raid.inventoryAtStart.includes(item.id),
  )
  const finalHub = hubAfterContract ?? result.hub

  const summary: RaidSummary = {
    outcome: 'failed',
    depth,
    gainedArtifacts: [],
    lostArtifacts,
    newMarks: diffNewMarks(hubBefore.roomMarks, result.hub.roomMarks),
    sanityBefore: characterBefore.sanity,
    sanityAfter: result.character.sanity,
    roomLevelAfter: finalHub.roomLevel,
    bestDepthAfter: finalHub.bestDepth,
    totalExtractionsAfter: finalHub.totalExtractions,
  }

  return attachContractToSummary(
    summary,
    hubBefore,
    finalHub,
    contractResult,
  )
}

export function buildAbandonSummary(
  characterBefore: Character,
  hubBefore: HubState,
  raid: RaidState,
  result: ReturnType<typeof failRaid>,
  depth: number,
  contractResult: ContractResult | null = null,
  hubAfterContract?: HubState,
): RaidSummary {
  return {
    ...buildFailSummary(
      characterBefore,
      hubBefore,
      raid,
      result,
      depth,
      contractResult,
      hubAfterContract,
    ),
    outcome: 'abandoned',
  }
}
