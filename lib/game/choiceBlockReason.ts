import { isChoiceAvailable } from './choiceUtils'
import { isChoiceVisible } from './choiceVisibility'

import type { Character, Choice } from '@/lib/types/game'

export type ChoiceBlockReason =
  | { kind: 'strength'; need: number; have: number }
  | { kind: 'agility'; need: number; have: number }
  | { kind: 'intelligence'; need: number; have: number }
  | { kind: 'origin' }
  | { kind: 'corruption'; need: number; have: number }
  | { kind: 'sanity'; max: number; have: number }
  | { kind: 'flag' }
  | { kind: 'artifact' }
  | { kind: 'journal' }

export function getChoiceBlockReason(
  choice: Choice,
  character: Character,
  journalEntries: string[] = [],
): ChoiceBlockReason | null {
  if (
    isChoiceAvailable(choice, character, journalEntries) ||
    !isChoiceVisible(choice, character, journalEntries)
  ) {
    return null
  }

  const req = choice.requirements
  if (!req) {
    return null
  }

  if (req.requiredOrigin && character.origin !== req.requiredOrigin) {
    return { kind: 'origin' }
  }

  if (req.forbiddenOrigin && character.origin === req.forbiddenOrigin) {
    return { kind: 'origin' }
  }

  if (req.strength && character.stats.strength < req.strength) {
    return { kind: 'strength', need: req.strength, have: character.stats.strength }
  }

  if (req.agility && character.stats.agility < req.agility) {
    return { kind: 'agility', need: req.agility, have: character.stats.agility }
  }

  if (req.intelligence && character.stats.intelligence < req.intelligence) {
    return {
      kind: 'intelligence',
      need: req.intelligence,
      have: character.stats.intelligence,
    }
  }

  if (
    typeof req.minCorruption === 'number' &&
    character.corruption < req.minCorruption
  ) {
    return {
      kind: 'corruption',
      need: req.minCorruption,
      have: character.corruption,
    }
  }

  if (typeof req.maxSanity === 'number' && character.sanity > req.maxSanity) {
    return { kind: 'sanity', max: req.maxSanity, have: character.sanity }
  }

  if (req.requiredFlag && !character.flags.includes(req.requiredFlag)) {
    return { kind: 'flag' }
  }

  if (
    req.requiredArtifact &&
    !character.inventory.some((item) => item.id === req.requiredArtifact)
  ) {
    return { kind: 'artifact' }
  }

  if (req.requiredJournal && !journalEntries.includes(req.requiredJournal)) {
    return { kind: 'journal' }
  }

  return null
}
