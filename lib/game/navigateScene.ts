import { getSceneById } from './sceneRegistry'
import {
  buildSceneAdjacency,
  canNavigateOnMap,
  findHistoryRewindIndex,
} from './sceneGraph'

import type { Character, Scene, SceneHistoryEntry } from '../types/game'

export function resolveMapNavigation(
  currentSceneId: string,
  targetSceneId: string,
  sceneHistory: SceneHistoryEntry[],
  character: Character,
  journalEntries: string[],
): {
  nextScene: Scene
  rewindToIndex: number
} | null {
  const visited = new Set([
    ...sceneHistory.map((entry) => entry.id),
    currentSceneId,
  ])

  if (!canNavigateOnMap(currentSceneId, targetSceneId, visited)) {
    return null
  }

  const rewindToIndex = findHistoryRewindIndex(targetSceneId, sceneHistory)

  if (rewindToIndex == null) {
    return null
  }

  const nextScene = getSceneById(targetSceneId, {
    character,
    journalEntries,
    visitedSceneIds: visited,
  })

  if (!nextScene) {
    return null
  }

  return { nextScene, rewindToIndex }
}

export function getMapReachableTargets(
  currentSceneId: string,
  sceneHistory: SceneHistoryEntry[],
  adjacency = buildSceneAdjacency(),
): string[] {
  const visited = new Set([
    ...sceneHistory.map((entry) => entry.id),
    currentSceneId,
  ])

  return getNeighborsFiltered(currentSceneId, visited, adjacency)
}

function getNeighborsFiltered(
  currentSceneId: string,
  visited: Set<string>,
  adjacency: Map<string, Set<string>>,
): string[] {
  const neighbors = adjacency.get(currentSceneId) ?? new Set()

  return [...neighbors]
    .filter((id) => visited.has(id))
    .sort()
}
