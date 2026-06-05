import { getSceneById } from './sceneRegistry'
import type { Character } from '@/lib/types/game'

export function getInitialScene(
  character?: Character,
  journalEntries: string[] = [],
) {
  return getSceneById('start', { character, journalEntries })!
}
