import type { Character } from '@/lib/types/game'
import type { Choice } from '@/lib/types/game'

export function isChoiceVisible(choice: Choice, character: Character) {
  if (!choice.requirements) {
    return true
  }

  const req = choice.requirements

  if (
    typeof req.minCorruption === 'number' &&
    character.corruption < req.minCorruption
  ) {
    return false
  }

  if (typeof req.maxSanity === 'number' && character.sanity > req.maxSanity) {
    return false
  }

  if (req.requiredFlag && !character.flags.includes(req.requiredFlag)) {
    return false
  }

  if (
    req.requiredArtifact &&
    !character.inventory.some(
      (artifact: any) => artifact.id === req.requiredArtifact,
    )
  ) {
    return false
  }

  return true
}
