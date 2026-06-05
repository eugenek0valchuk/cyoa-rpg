import { ACT1_SCENE_IDS } from '@/locales/ru/scenes/act1'
import { boostPoolForActQuest } from '@/lib/game/acts/questEngine'

import { buildDirectorState } from './director'
import { choicePools, phasePools } from './scenePools'
import { cloneScene, getSceneById, sceneRegistry } from './sceneRegistry'

import type { Character, Choice, Scene, SceneHistoryEntry } from '../types/game'
import type { HubState } from '../types/hub'

interface PickSceneParams {
  pool: string[]
  visitedSceneIds: Set<string>
  visitedTitles: Set<string>
  seed: number
  character: Character
  journalEntries: string[]
}

function sceneContext(
  character: Character,
  journalEntries: string[],
  visitedSceneIds: Set<string>,
) {
  return { character, journalEntries, visitedSceneIds }
}

function boostPoolForFlags(
  pool: string[],
  character: Character,
  visitedSceneIds: Set<string>,
): string[] {
  const boosted: string[] = []

  const tryBoost = (sceneId: string, flag: string) => {
    if (
      character.flags.includes(flag) &&
      pool.includes(sceneId) &&
      !visitedSceneIds.has(sceneId) &&
      !boosted.includes(sceneId)
    ) {
      boosted.push(sceneId)
    }
  }

  tryBoost('encounter_synod_acolyte', 'synod_mark')
  tryBoost('encounter_wax_pilgrim', 'wax_offered')
  tryBoost('encounter_choir_remnant', 'choir_split')

  return boosted
}

function boostPoolForJournal(
  pool: string[],
  journalEntries: string[],
  visitedSceneIds: Set<string>,
): string[] {
  const journalBoosts: Record<string, string> = {
    npc_wax: 'encounter_wax_pilgrim',
    npc_bell_wretch: 'encounter_bell_wretch',
    npc_choir: 'encounter_choir_remnant',
    npc_synod: 'encounter_synod_acolyte',
    npc_breathless: 'merchant',
  }

  const boosted: string[] = []

  for (const [journalId, sceneId] of Object.entries(journalBoosts)) {
    if (
      journalEntries.includes(journalId) &&
      pool.includes(sceneId) &&
      !visitedSceneIds.has(sceneId) &&
      !boosted.includes(sceneId)
    ) {
      boosted.push(sceneId)
    }
  }

  return boosted
}

function filterSeenEncounters(
  pool: string[],
  encountersSeen: Set<string>,
): string[] {
  const withoutSeen = pool.filter(
    (sceneId) =>
      !sceneId.startsWith('encounter_') || !encountersSeen.has(sceneId),
  )

  return withoutSeen.length > 0 ? withoutSeen : pool
}

function boostPoolForOrigin(
  pool: string[],
  character: Character,
  visitedSceneIds: Set<string>,
): string[] {
  const boosted: string[] = []

  if (
    character.origin === 'heretic' &&
    pool.includes('encounter_heretic_cog') &&
    !visitedSceneIds.has('encounter_heretic_cog') &&
    !boosted.includes('encounter_heretic_cog')
  ) {
    boosted.push('encounter_heretic_cog')
  }

  return boosted
}

function boostPoolForNpcFlags(
  pool: string[],
  npcFlags: string[],
  visitedSceneIds: Set<string>,
): string[] {
  const boosts: Record<string, string> = {
    synod_mark: 'encounter_synod_acolyte',
    met_breathless: 'merchant',
    wax_offered: 'encounter_wax_pilgrim',
    choir_split: 'fracture_choir',
    met_heretic_cog: 'encounter_heretic_cog',
    heard_the_bell: 'bell',
  }

  const boosted: string[] = []

  for (const flag of npcFlags) {
    const sceneId = boosts[flag]

    if (
      sceneId &&
      pool.includes(sceneId) &&
      !visitedSceneIds.has(sceneId) &&
      !boosted.includes(sceneId)
    ) {
      boosted.push(sceneId)
    }
  }

  return boosted
}

function boostPoolForContractFlags(
  pool: string[],
  character: Character,
  visitedSceneIds: Set<string>,
): string[] {
  const boosted: string[] = []

  for (const flag of character.flags) {
    if (!flag.startsWith('contract_boost_')) {
      continue
    }

    const sceneId = flag.slice('contract_boost_'.length)

    if (
      pool.includes(sceneId) &&
      !visitedSceneIds.has(sceneId) &&
      !boosted.includes(sceneId)
    ) {
      boosted.push(sceneId)
    }
  }

  return boosted
}

interface PickSceneParamsWithEncounters extends PickSceneParams {
  encountersSeen?: Set<string>
  npcFlags?: string[]
  hub?: HubState
}

function filterInactiveAct1Scenes(
  pool: string[],
  hub: HubState | undefined,
  character: Character,
  visitedSceneIds: Set<string>,
): string[] {
  const activeAct1 = new Set(
    boostPoolForActQuest(pool, hub, character, visitedSceneIds),
  )

  return pool.filter((sceneId) => {
    if (!ACT1_SCENE_IDS.includes(sceneId)) {
      return true
    }

    return activeAct1.has(sceneId)
  })
}

function pickFromPool({
  pool,
  visitedSceneIds,
  visitedTitles,
  seed,
  character,
  journalEntries,
  encountersSeen = new Set<string>(),
  npcFlags = [],
  hub,
}: PickSceneParamsWithEncounters): Scene | null {
  const eligiblePool = filterInactiveAct1Scenes(
    filterSeenEncounters(pool, encountersSeen),
    hub,
    character,
    visitedSceneIds,
  )
  const actBoosted = boostPoolForActQuest(
    eligiblePool,
    hub,
    character,
    visitedSceneIds,
  )
  const flagBoosted = boostPoolForFlags(eligiblePool, character, visitedSceneIds)
  const originBoosted = boostPoolForOrigin(
    eligiblePool,
    character,
    visitedSceneIds,
  )
  const npcBoosted = boostPoolForNpcFlags(
    eligiblePool,
    npcFlags,
    visitedSceneIds,
  )
  const journalBoosted = boostPoolForJournal(
    eligiblePool,
    journalEntries,
    visitedSceneIds,
  )
  const contractBoosted = boostPoolForContractFlags(
    eligiblePool,
    character,
    visitedSceneIds,
  )
  const boosted = [
    ...actBoosted,
    ...flagBoosted.filter((id) => !actBoosted.includes(id)),
    ...originBoosted.filter(
      (id) => !actBoosted.includes(id) && !flagBoosted.includes(id),
    ),
    ...npcBoosted.filter(
      (id) =>
        !actBoosted.includes(id) &&
        !flagBoosted.includes(id) &&
        !originBoosted.includes(id),
    ),
    ...journalBoosted.filter(
      (id) =>
        !actBoosted.includes(id) &&
        !flagBoosted.includes(id) &&
        !originBoosted.includes(id) &&
        !npcBoosted.includes(id),
    ),
    ...contractBoosted.filter(
      (id) =>
        !actBoosted.includes(id) &&
        !flagBoosted.includes(id) &&
        !originBoosted.includes(id) &&
        !npcBoosted.includes(id) &&
        !journalBoosted.includes(id),
    ),
  ]

  if (boosted.length > 0) {
    const sceneId = boosted[Math.abs(seed) % boosted.length]!
    return (
      getSceneById(
        sceneId,
        sceneContext(character, journalEntries, visitedSceneIds),
      ) ?? null
    )
  }

  const available = eligiblePool.filter((sceneId) => {
    const scene = sceneRegistry[sceneId]

    if (!scene) {
      return false
    }

    if (visitedSceneIds.has(scene.id)) {
      return false
    }

    if (visitedTitles.has(scene.title.toLowerCase())) {
      return false
    }

    return true
  })

  const candidates = available.length > 0 ? available : eligiblePool
  const index = Math.abs(seed) % candidates.length
  const sceneId = candidates[index]

  return sceneId
    ? getSceneById(
        sceneId,
        sceneContext(character, journalEntries, visitedSceneIds),
      ) ?? null
    : null
}

function buildSeed(parts: string[]): number {
  return parts.reduce((acc, part) => acc + part.split('').reduce((s, c) => s + c.charCodeAt(0), 0), 0)
}

function wasSceneVisited(
  sceneId: string,
  title: string,
  visitedSceneIds: Set<string>,
  visitedTitles: Set<string>,
): boolean {
  return (
    visitedSceneIds.has(sceneId) ||
    visitedTitles.has(title.toLowerCase())
  )
}

function getChoiceRouteId(choice: Choice): string {
  return choice.targetSceneId ?? choice.id
}

export function resolveDirectedScene(
  currentScene: Scene,
  choice: Choice,
  character: Character,
  sceneHistory: SceneHistoryEntry[],
  journalEntries: string[] = [],
  encountersSeen: string[] = [],
  npcFlags: string[] = [],
  hub?: HubState,
): Scene {
  const visitedSceneIds = new Set(sceneHistory.map((entry) => entry.id))
  const encountersSeenSet = new Set(encountersSeen)
  const visitedTitles = new Set(
    sceneHistory.map((entry) => entry.title.toLowerCase()),
  )

  const ctx = sceneContext(character, journalEntries, visitedSceneIds)

  const routeId = getChoiceRouteId(choice)
  const directScene = getSceneById(routeId, ctx)

  if (
    directScene &&
    !wasSceneVisited(
      directScene.id,
      directScene.title,
      visitedSceneIds,
      visitedTitles,
    )
  ) {
    return directScene
  }

  const choicePool = choicePools[routeId] ?? choicePools[choice.id]

  if (choicePool) {
    const pooled = pickFromPool({
      pool: choicePool,
      visitedSceneIds,
      visitedTitles,
      seed: buildSeed([
        currentScene.id,
        choice.id,
        character.name,
        String(sceneHistory.length),
      ]),
      character,
      journalEntries,
      encountersSeen: encountersSeenSet,
      npcFlags,
      hub,
    })

    if (pooled) {
      return pooled
    }
  }

  const director = buildDirectorState(character, sceneHistory)
  const phasePool = phasePools[director.phase]

  const phaseScene = pickFromPool({
    pool: phasePool,
    visitedSceneIds,
    visitedTitles,
    seed: buildSeed([
      director.phase,
      choice.id,
      currentScene.id,
      String(character.corruption),
    ]),
    character,
    journalEntries,
    encountersSeen: encountersSeenSet,
    npcFlags,
    hub,
  })

  if (phaseScene) {
    return phaseScene
  }

  const fallback =
    getSceneById('descent_echoes', ctx) ?? getSceneById('mouth', ctx)

  if (!fallback) {
    throw new Error(`No scene found for choice "${choice.id}"`)
  }

  return fallback
}
