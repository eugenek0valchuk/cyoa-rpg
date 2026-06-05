import type { Artifact, ArtifactEffect, Character } from '@/lib/types/game'
import { clampStat } from './clampStat'

export const DEFAULT_ARTIFACT_IMAGE = '/ui/gothic-cursed-rosary.png'

const ARTIFACT_IMAGE_BY_ID: Record<string, string> = {
  ashen_faceless_mask: '/artifacts/ashen-faceless-mask.png',
  buried_choir_candle: '/artifacts/buried-choir-candle.png',
  black_vertebrae: '/artifacts/black-vertebrae.png',
  inverted_rosary: '/artifacts/inverted-rosary.png',
  drowned_bell_fragment: '/artifacts/drowned-bell-fragment.png',
}

export function getArtifactImageSrc(artifact: Artifact): string {
  return artifact.imageSrc ?? ARTIFACT_IMAGE_BY_ID[artifact.id] ?? DEFAULT_ARTIFACT_IMAGE
}

export function sumArtifactEffects(items: Artifact[]): ArtifactEffect {
  const total: ArtifactEffect = {}

  for (const item of items) {
    if (!item.effects) {
      continue
    }

    for (const key of Object.keys(item.effects) as (keyof ArtifactEffect)[]) {
      const value = item.effects[key]
      if (value == null) {
        continue
      }
      total[key] = (total[key] ?? 0) + value
    }
  }

  return total
}

export function applyArtifactEffectToCharacter(
  character: Character,
  effect: ArtifactEffect,
): Character {
  const next = { ...character, stats: { ...character.stats } }

  if (effect.sanity) {
    next.sanity = clampStat(next.sanity + effect.sanity)
  }

  if (effect.corruption) {
    next.corruption = clampStat(next.corruption + effect.corruption)
  }

  if (effect.strength) {
    next.stats.strength += effect.strength
  }

  if (effect.agility) {
    next.stats.agility += effect.agility
  }

  if (effect.intelligence) {
    next.stats.intelligence += effect.intelligence
  }

  return next
}

export function applyLoadoutPassiveEffects(
  character: Character,
  loadout: Artifact[],
): Character {
  return applyArtifactEffectToCharacter(character, sumArtifactEffects(loadout))
}

export function applyArtifactPickupEffects(
  character: Character,
  artifact: Artifact,
): Character {
  let next = character

  if (artifact.onAcquire) {
    next = applyArtifactEffectToCharacter(next, artifact.onAcquire)
  }

  if (artifact.effects) {
    next = applyArtifactEffectToCharacter(next, artifact.effects)
  }

  return next
}

export function hasArtifactEffect(effect?: ArtifactEffect | null): boolean {
  if (!effect) {
    return false
  }

  return Object.values(effect).some((value) => value !== 0 && value != null)
}

export type ArtifactEffectLine = {
  key: keyof ArtifactEffect
  delta: number
}

export function getArtifactEffectLines(effect?: ArtifactEffect | null): ArtifactEffectLine[] {
  if (!effect) {
    return []
  }

  const keys: (keyof ArtifactEffect)[] = [
    'sanity',
    'corruption',
    'strength',
    'agility',
    'intelligence',
  ]

  return keys
    .filter((key) => effect[key] != null && effect[key] !== 0)
    .map((key) => ({ key, delta: effect[key] as number }))
}
