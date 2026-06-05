import { resolveDirectedScene } from './sceneDirector'

import type { Choice, Character, Scene, SceneHistoryEntry } from '../types/game'

interface ResolveNextSceneParams {
  currentScene: Scene
  choice: Choice
  character: Character
  sceneHistory: SceneHistoryEntry[]
}

export function resolveNextScene({
  currentScene,
  choice,
  character,
  sceneHistory,
}: ResolveNextSceneParams): Scene {
  return resolveDirectedScene(currentScene, choice, character, sceneHistory)
}
