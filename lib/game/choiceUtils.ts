import type { Character, Choice } from '@/lib/types/game'
import { isChoiceVisible } from './choiceVisibility'

export function isChoiceAvailable(
  choice: Choice,
  character: Character,
): boolean {
  if (!isChoiceVisible(choice, character)) {
    return false
  }

  const requirements = choice.requirements
  if (!requirements) {
    return true
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
