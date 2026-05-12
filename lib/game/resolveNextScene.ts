import { scenes } from './scenes'

import type { Choice, Character, Scene, SceneMemory } from '../types/game'

interface ResolveNextSceneParams {
  currentScene: Scene
  choice: Choice
  character: Character
  sceneHistory: SceneMemory[]
  generateScene: (
    currentScene: Scene,
    choice: Choice,
    character: Character,
    sceneHistory: SceneMemory[],
  ) => Promise<Scene>
}

export async function resolveNextScene({
  currentScene,
  choice,
  character,
  sceneHistory,
  generateScene,
}: ResolveNextSceneParams) {
  const localScene = scenes[choice.id]

  if (localScene) {
    return localScene
  }

  const generatedScene = await generateScene(
    currentScene,
    choice,
    character,
    sceneHistory,
  )

  if (!generatedScene) {
    throw new Error('Failed to generate scene')
  }

  generatedScene.id ??= crypto.randomUUID()

  return generatedScene
}
