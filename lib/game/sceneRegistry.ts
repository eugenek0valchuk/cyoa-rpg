import { scenes } from './scenes'
import { eventScenes } from './content/eventScenes'
import { phaseScenes } from './content/phaseScenes'

import type { Scene } from '../types/game'

export const sceneRegistry: Record<string, Scene> = {
  ...scenes,
  ...eventScenes,
  ...phaseScenes,
}

export function cloneScene(scene: Scene): Scene {
  return {
    ...scene,
    options: scene.options.map((option) => ({ ...option })),
  }
}

export function getSceneById(sceneId: string): Scene | undefined {
  const scene = sceneRegistry[sceneId]

  if (!scene) {
    return undefined
  }

  return cloneScene(scene)
}
