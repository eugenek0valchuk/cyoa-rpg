import type { Character, SceneHistoryEntry } from '../types/game'

export type StoryPhase =
  | 'DESCENT'
  | 'WHISPERS'
  | 'FRACTURE'
  | 'COMMUNION'
  | 'COLLAPSE'

export type SceneType =
  | 'exploration'
  | 'encounter'
  | 'revelation'
  | 'ritual'
  | 'nightmare'
  | 'transition'
  | 'ending'

export interface DirectorState {
  phase: StoryPhase
  nextSceneType: SceneType
  escalationLevel: number
  forceEnding: boolean
}

export function getStoryPhase(
  corruption: number,
  historyLength: number,
): StoryPhase {
  if (corruption >= 80) {
    return 'COLLAPSE'
  }

  if (corruption >= 60) {
    return 'COMMUNION'
  }

  if (corruption >= 40) {
    return 'FRACTURE'
  }

  if (historyLength >= 6) {
    return 'WHISPERS'
  }

  return 'DESCENT'
}

function getNextSceneType(historyLength: number): SceneType {
  if (historyLength === 0) {
    return 'exploration'
  }

  if (historyLength % 8 === 0) {
    return 'ritual'
  }

  if (historyLength % 6 === 0) {
    return 'revelation'
  }

  if (historyLength % 4 === 0) {
    return 'encounter'
  }

  return 'transition'
}

export function buildDirectorState(
  character: Character,
  history: SceneHistoryEntry[],
): DirectorState {
  const phase = getStoryPhase(character.corruption, history.length)

  return {
    phase,
    nextSceneType: getNextSceneType(history.length),
    escalationLevel: Math.min(10, Math.floor(history.length / 3)),
    forceEnding: character.corruption >= 90 || character.sanity <= 10,
  }
}
