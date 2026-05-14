import { Scene, SceneHistoryEntry } from '../types/game'

export function detectSceneLoop(scene: Scene, history: SceneHistoryEntry[]) {
  const recent = history.slice(-5)

  return recent.some((s) => {
    const sameTitle = s.title.toLowerCase() === scene.title.toLowerCase()

    const sameDesc =
      s.description.slice(0, 80) === scene.description.slice(0, 80)

    return sameTitle || sameDesc
  })
}
