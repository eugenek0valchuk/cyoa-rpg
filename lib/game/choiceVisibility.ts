import type { Character, Choice } from '@/lib/types/game'

export function isChoiceVisible(
  choice: Choice,
  character: Character,
  journalEntries: string[] = [],
): boolean {
  if (!choice.requirements) {
    return true
  }

  const req = choice.requirements

  if (req.requiredOrigin && character.origin !== req.requiredOrigin) {
    return false
  }

  if (req.forbiddenOrigin && character.origin === req.forbiddenOrigin) {
    return false
  }

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
      (artifact) => artifact.id === req.requiredArtifact,
    )
  ) {
    return false
  }

  if (
    req.forbiddenArtifact &&
    character.inventory.some(
      (artifact) => artifact.id === req.forbiddenArtifact,
    )
  ) {
    return false
  }

  if (
    req.requiredJournal &&
    !journalEntries.includes(req.requiredJournal)
  ) {
    return false
  }

  return true
}
