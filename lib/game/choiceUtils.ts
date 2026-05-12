import type { Character, Choice } from '@/lib/types/game'

export function isChoiceAvailable(
  choice: Choice,
  character: Character,
): boolean {
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

  if (
    requirements.sanityBelow !== undefined &&
    character.sanity >= requirements.sanityBelow
  ) {
    return false
  }

  if (
    requirements.corruptionAbove !== undefined &&
    character.corruption <= requirements.corruptionAbove
  ) {
    return false
  }

  if (
    requirements.hasItem &&
    !character.inventory.some(
      (artifact) => artifact.id === requirements.hasItem,
    )
  ) {
    return false
  }

  return true
}
