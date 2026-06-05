import { resolveDirectedScene } from './sceneDirector'

import type { Choice, Character, Scene, SceneHistoryEntry } from '../types/game'
import type { HubState } from '../types/hub'

interface ResolveNextSceneParams {
  currentScene: Scene
  choice: Choice
  character: Character
  sceneHistory: SceneHistoryEntry[]
  journalEntries?: string[]
  encountersSeen?: string[]
  npcFlags?: string[]
  hub?: HubState
}

export function resolveNextScene({
  currentScene,
  choice,
  character,
  sceneHistory,
  journalEntries = [],
  encountersSeen = [],
  npcFlags = [],
  hub,
}: ResolveNextSceneParams): Scene {
  return resolveDirectedScene(
    currentScene,
    choice,
    character,
    sceneHistory,
    journalEntries,
    encountersSeen,
    npcFlags,
    hub,
  )
}
