import { buildDirectorState } from './director'
import { choicePools, phasePools } from './scenePools'
import { cloneScene, getSceneById, sceneRegistry } from './sceneRegistry'

import type { Character, Choice, Scene, SceneHistoryEntry } from '../types/game'

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

function pickFromPool({
  pool,
  visitedSceneIds,
  visitedTitles,
  seed,
  character,
  journalEntries,
}: PickSceneParams): Scene | null {
  const flagBoosted = boostPoolForFlags(pool, character, visitedSceneIds)
  const journalBoosted = boostPoolForJournal(
    pool,
    journalEntries,
    visitedSceneIds,
  )
  const boosted = [...flagBoosted, ...journalBoosted.filter((id) => !flagBoosted.includes(id))]

  if (boosted.length > 0) {
    const sceneId = boosted[Math.abs(seed) % boosted.length]!
    return (
      getSceneById(
        sceneId,
        sceneContext(character, journalEntries, visitedSceneIds),
      ) ?? null
    )
  }

  const available = pool.filter((sceneId) => {
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

  const candidates = available.length > 0 ? available : pool
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
): Scene {
  const visitedSceneIds = new Set(sceneHistory.map((entry) => entry.id))
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
