import { buildDirectorState } from './director'
import { choicePools, phasePools } from './scenePools'
import { cloneScene, getSceneById, sceneRegistry } from './sceneRegistry'

import type { Character, Choice, Scene, SceneHistoryEntry } from '../types/game'

interface PickSceneParams {
  pool: string[]
  visitedSceneIds: Set<string>
  visitedTitles: Set<string>
  seed: number
}

function pickFromPool({
  pool,
  visitedSceneIds,
  visitedTitles,
  seed,
}: PickSceneParams): Scene | null {
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

  return sceneId ? getSceneById(sceneId) ?? null : null
}

function buildSeed(parts: string[]): number {
  return parts.reduce((acc, part) => acc + part.split('').reduce((s, c) => s + c.charCodeAt(0), 0), 0)
}

export function resolveDirectedScene(
  currentScene: Scene,
  choice: Choice,
  character: Character,
  sceneHistory: SceneHistoryEntry[],
): Scene {
  const visitedSceneIds = new Set(sceneHistory.map((entry) => entry.id))
  const visitedTitles = new Set(
    sceneHistory.map((entry) => entry.title.toLowerCase()),
  )

  const directScene = getSceneById(choice.id)

  if (directScene && !visitedTitles.has(directScene.title.toLowerCase())) {
    return directScene
  }

  const choicePool = choicePools[choice.id]

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
    })

    if (pooled) {
      return pooled
    }
  }

  if (directScene) {
    return directScene
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
  })

  if (phaseScene) {
    return phaseScene
  }

  const fallback = getSceneById('descent_echoes') ?? getSceneById('mouth')

  if (!fallback) {
    throw new Error(`No scene found for choice "${choice.id}"`)
  }

  return fallback
}
