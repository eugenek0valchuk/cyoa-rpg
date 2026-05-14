import type { Scene, SceneHistoryEntry } from '../types/game'

interface Params {
  currentScene: Scene
  nextScene: Scene
  pushSceneHistory: (scene: SceneHistoryEntry) => void
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
