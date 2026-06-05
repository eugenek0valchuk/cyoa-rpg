import { applyOriginToScene } from './applyOriginScene'
import { applyRepeatToScene } from './applyRepeatScene'

import type { Character, Scene } from '../types/game'

export interface PersonalizeSceneContext {
  character: Character
  journalEntries?: string[]
  visitedSceneIds?: Set<string>
}

export function personalizeScene(
  scene: Scene,
  context: PersonalizeSceneContext,
): Scene {
  const journalEntries = context.journalEntries ?? []
  const visitedSceneIds = context.visitedSceneIds ?? new Set<string>()

  const withOrigin = applyOriginToScene(
    scene,
    context.character,
    journalEntries,
  )

  return applyRepeatToScene(withOrigin, {
    character: context.character,
    journalEntries,
    visitedSceneIds,
  })
}
