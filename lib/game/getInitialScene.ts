import { getPendingAct1Scene } from '@/lib/game/acts/questEngine'
import { getSceneById } from './sceneRegistry'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

export function getInitialScene(
  character?: Character,
  journalEntries: string[] = [],
  hub?: HubState,
) {
  const pendingAct1 =
    character && hub
      ? getPendingAct1Scene(hub, character, new Set<string>())
      : null

  if (pendingAct1) {
    const scene = getSceneById(pendingAct1, {
      character,
      journalEntries,
      visitedSceneIds: new Set<string>(),
    })

    if (scene) {
      return scene
    }
  }

  return getSceneById('start', { character, journalEntries })!
}
