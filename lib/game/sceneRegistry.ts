import { t } from '@/lib/i18n'

import { personalizeScene } from './personalizeScene'

export const sceneRegistry: Record<string, import('../types/game').Scene> = t.scenes

export interface GetSceneContext {
  character?: import('../types/game').Character
  journalEntries?: string[]
  visitedSceneIds?: Set<string>
}

export function cloneScene(scene: import('../types/game').Scene) {
  return {
    ...scene,
    options: scene.options.map((option) => ({ ...option })),
  }
}

export function getSceneById(sceneId: string, context: GetSceneContext = {}) {
  const scene = sceneRegistry[sceneId]

  if (!scene) {
    return undefined
  }

  const cloned = cloneScene(scene)

  if (!context.character) {
    return cloned
  }

  return personalizeScene(cloned, {
    character: context.character,
    journalEntries: context.journalEntries,
    visitedSceneIds: context.visitedSceneIds,
  })
}
