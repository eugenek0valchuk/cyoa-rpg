import type { Scene, SceneMemory } from '../types/game'

interface Params {
  currentScene: Scene

  nextScene: Scene

  pushSceneHistory: (scene: SceneMemory) => void

  pushHistory: (sceneId: string) => void
}

export function commitSceneTransition({
  currentScene,
  nextScene,
  pushSceneHistory,
  pushHistory,
}: Params) {
  pushSceneHistory({
    id: currentScene.id,
    title: currentScene.title,
    description: currentScene.description,
  })

  pushHistory(nextScene.id)
}
