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
    requirements.maxSanity !== undefined &&
    character.sanity > requirements.maxSanity
  ) {
    return false
  }

  if (
    requirements.minCorruption !== undefined &&
    character.corruption < requirements.minCorruption
  ) {
    return false
  }

  if (
    requirements.requiredArtifact &&
    !character.inventory.some(
      (artifact) => artifact.id === requirements.requiredArtifact,
    )
  ) {
    return false
  }

  if (
    requirements.requiredFlag &&
    !character.flags.includes(requirements.requiredFlag)
  ) {
    return false
  }

  return true
}
