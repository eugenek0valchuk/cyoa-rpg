import { applyChoiceEffects } from './applyChoiceEffects'
import { applyRaidModifierTick } from './raidModifiers'
import type { RaidModifierId } from './raidModifiers'
import { ZONE_BRIDGE_CONTINUE_ID } from './zoneTransitions'

import type { Artifact, Character, Choice } from '@/lib/types/game'

function applyModifierForChoice(
  character: Character,
  choice: Choice,
  modifierId?: RaidModifierId | null,
  roomMarks: string[] = [],
): Character {
  if (choice.id === ZONE_BRIDGE_CONTINUE_ID || !modifierId) {
    return character
  }

  return applyRaidModifierTick(character, modifierId, roomMarks)
}

/** Смягчает разовый урон рассудку, когда сосуд уже на грани */
export function softenSanityDelta(currentSanity: number, delta: number): number {
  if (delta >= 0) {
    return delta
  }

  const loss = Math.abs(delta)
  let maxLoss = 9

  if (currentSanity <= 15) {
    maxLoss = 4
  } else if (currentSanity <= 28) {
    maxLoss = 6
  }

  return -Math.min(loss, maxLoss)
}

export function computeSanityAfterChoice(
  character: Character,
  choice: Choice,
  artifacts: Record<string, Artifact>,
  modifierId?: RaidModifierId | null,
  roomMarks: string[] = [],
): number {
  const { updatedCharacter } = applyChoiceEffects({
    character,
    choice,
    artifacts,
  })

  return applyModifierForChoice(
    updatedCharacter,
    choice,
    modifierId,
    roomMarks,
  ).sanity
}

export function computeCorruptionAfterChoice(
  character: Character,
  choice: Choice,
  artifacts: Record<string, Artifact>,
  modifierId?: RaidModifierId | null,
  roomMarks: string[] = [],
): number {
  const { updatedCharacter } = applyChoiceEffects({
    character,
    choice,
    artifacts,
  })

  return applyModifierForChoice(
    updatedCharacter,
    choice,
    modifierId,
    roomMarks,
  ).corruption
}

export function isDangerousSanityChoice(
  character: Character,
  choice: Choice,
  artifacts: Record<string, Artifact>,
  modifierId?: RaidModifierId | null,
  roomMarks: string[] = [],
): boolean {
  return (
    computeSanityAfterChoice(
      character,
      choice,
      artifacts,
      modifierId,
      roomMarks,
    ) <= 8
  )
}
