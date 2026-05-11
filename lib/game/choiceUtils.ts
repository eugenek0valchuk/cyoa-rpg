import { Character, Choice } from '@/lib/types/game'

export function isChoiceAvailable(
  choice: Choice,
  character: Character,
): boolean {
  return !choice.requires || choice.requires(character)
}
