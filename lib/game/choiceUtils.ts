import { isChoiceVisible } from './choiceVisibility'

import type { Character, Choice } from '../types/game'

export function isChoiceAvailable(
  choice: Choice,
  character: Character,
  journalEntries: string[] = [],
): boolean {
  if (!isChoiceVisible(choice, character, journalEntries)) {
    return false
  }

  const requirements = choice.requirements
  if (!requirements) {
    return true
  }

  if (
    requirements.requiredOrigin &&
    character.origin !== requirements.requiredOrigin
  ) {
    return false
  }

  if (
    requirements.forbiddenOrigin &&
    character.origin === requirements.forbiddenOrigin
  ) {
    return false
  }

  if (
    requirements.strength &&
    character.stats.strength < requirements.strength
  ) {
    return false
  }

  if (requirements.agility && character.stats.agility < requirements.agility) {
    return false
  }

  if (
    requirements.intelligence &&
    character.stats.intelligence < requirements.intelligence
  ) {
    return false
  }

  return true
}

/** Успешный Risk-бросок снимает только пороги силы/ловкости/интеллекта. */
export function isChoiceAvailableAfterRiskSuccess(
  choice: Choice,
  character: Character,
  journalEntries: string[] = [],
): boolean {
  if (!isChoiceVisible(choice, character, journalEntries)) {
    return false
  }

  const requirements = choice.requirements
  if (!requirements) {
    return true
  }

  if (
    requirements.requiredOrigin &&
    character.origin !== requirements.requiredOrigin
  ) {
    return false
  }

  if (
    requirements.forbiddenOrigin &&
    character.origin === requirements.forbiddenOrigin
  ) {
    return false
  }

  return true
}
