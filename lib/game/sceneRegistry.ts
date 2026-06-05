import { t } from '@/lib/i18n'

export const sceneRegistry: Record<string, import('../types/game').Scene> = t.scenes

export function cloneScene(scene: import('../types/game').Scene) {
  return {
    ...scene,
    options: scene.options.map((option) => ({ ...option })),
  }
}

export function getSceneById(sceneId: string) {
  const scene = sceneRegistry[sceneId]

  if (!scene) {
    return undefined
  }

  return cloneScene(scene)
}
