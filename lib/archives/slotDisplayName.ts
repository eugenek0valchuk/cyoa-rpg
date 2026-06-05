import type { Character } from '@/lib/types/game'

export function getSlotDisplayName(
  character: Character | null | undefined,
  emptyLabel: string,
  unnamedLabel: string,
): string {
  if (!character) {
    return emptyLabel
  }

  const name = character.name?.trim()

  return name || unnamedLabel
}
