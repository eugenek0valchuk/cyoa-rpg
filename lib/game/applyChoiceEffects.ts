import { clampStat } from './clampStat'
import { softenSanityDelta } from './sanityPacing'

import type { Artifact, Character, Choice } from '../types/game'

interface ApplyChoiceEffectsParams {
  character: Character
  choice: Choice
  artifacts: Record<string, Artifact>
}

export function applyChoiceEffects({
  character,
  choice,
  artifacts,
}: ApplyChoiceEffectsParams) {
  const sanityDelta = softenSanityDelta(
    character.sanity,
    choice.effects?.sanity ?? 0,
  )

  const flagDeltas = [
    ...(choice.effects?.addFlag ? [choice.effects.addFlag] : []),
    ...(choice.effects?.addFlags ?? []),
  ]

  const updatedCharacter = {
    ...character,

    sanity: clampStat(character.sanity + sanityDelta),

    corruption: clampStat(
      character.corruption + (choice.effects?.corruption ?? 0),
    ),

    flags:
      flagDeltas.length > 0
        ? Array.from(new Set([...character.flags, ...flagDeltas]))
        : character.flags,

    inventory: [...character.inventory],
  }

  let revealedArtifact: Artifact | null = null

  if (choice.effects?.addArtifact) {
    const artifact = artifacts[choice.effects.addArtifact]

    if (artifact) {
      const alreadyOwned = character.inventory.some(
        (item) => item.id === artifact.id,
      )

      if (!alreadyOwned) {
        updatedCharacter.inventory.push(artifact)

        updatedCharacter.sanity = clampStat(
          updatedCharacter.sanity + (artifact.effects?.sanity ?? 0),
        )

        updatedCharacter.corruption = clampStat(
          updatedCharacter.corruption + (artifact.effects?.corruption ?? 0),
        )

        revealedArtifact = artifact
      }
    }
  }

  return {
    updatedCharacter,
    revealedArtifact,
  }
}
