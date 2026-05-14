import { artifacts } from '@/lib/game/artifacts'
import type {
  Character,
  Choice,
  ChoiceRequirements,
  Scene,
} from '../types/game'

const MAX_OPTIONS = 4
const MIN_OPTIONS = 2

interface RawChoice {
  id?: unknown
  text?: unknown
  requirements?: unknown
  effects?: unknown
}

interface RawScene {
  title?: unknown
  description?: unknown
  options?: RawChoice[]
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const cleaned = value.trim()
  return cleaned.length > 0 ? cleaned : fallback
}

function normalizeRequirements(requirements: unknown): ChoiceRequirements {
  if (!requirements || typeof requirements !== 'object') return {}

  const normalized: ChoiceRequirements = {}
  const req = requirements as Record<string, unknown>

  if (
    typeof req.minCorruption === 'number' &&
    Number.isFinite(req.minCorruption)
  ) {
    normalized.minCorruption = Math.max(
      0,
      Math.min(100, Math.round(req.minCorruption)),
    )
  }

  if (typeof req.maxSanity === 'number' && Number.isFinite(req.maxSanity)) {
    normalized.maxSanity = Math.max(0, Math.min(100, Math.round(req.maxSanity)))
  }

  if (typeof req.requiredFlag === 'string') {
    normalized.requiredFlag = req.requiredFlag
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
  }

  if (
    typeof req.requiredArtifact === 'string' &&
    artifacts[req.requiredArtifact]
  ) {
    normalized.requiredArtifact = req.requiredArtifact
  }

  return normalized
}

function normalizeEffects(
  effects: unknown,
  ownedArtifacts: Set<string>,
): Choice['effects'] {
  const normalized: NonNullable<Choice['effects']> = {}
  const eff = effects as Record<string, unknown> | null | undefined

  if (typeof eff?.sanity === 'number' && Number.isFinite(eff.sanity)) {
    normalized.sanity = Math.max(-25, Math.min(25, Math.round(eff.sanity)))
  }

  if (typeof eff?.corruption === 'number' && Number.isFinite(eff.corruption)) {
    normalized.corruption = Math.max(
      -25,
      Math.min(25, Math.round(eff.corruption)),
    )
  }

  if (typeof eff?.addFlag === 'string') {
    normalized.addFlag = eff.addFlag.trim().toLowerCase().replace(/\s+/g, '_')
  }

  if (
    typeof eff?.addArtifact === 'string' &&
    artifacts[eff.addArtifact] &&
    !ownedArtifacts.has(eff.addArtifact)
  ) {
    normalized.addArtifact = eff.addArtifact
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

function canAccessOption(option: Choice, character?: Character): boolean {
  if (!character) return true

  const requirements = option.requirements
  if (!requirements) return true

  if (
    requirements.minCorruption !== undefined &&
    character.corruption < requirements.minCorruption
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
    requirements.requiredFlag &&
    !character.flags.includes(requirements.requiredFlag)
  ) {
    return false
  }

  return true
}

function createFallbackOptions(): Choice[] {
  return [
    {
      id: 'continue_forward',
      text: 'Continue deeper into the abyss',
      effects: { sanity: -3 },
    },
    {
      id: 'observe',
      text: 'Remain still and listen to the dark',
    },
  ]
}

export function validateScene(
  rawScene: RawScene,
  ownedArtifacts: Set<string>,
  character?: Character,
): Scene {
  const title = normalizeText(rawScene?.title, 'Unknown Depths').slice(0, 80)
  const description = normalizeText(
    rawScene?.description,
    'The darkness shifts around you.',
  ).slice(0, 2200)
  const rawOptions = Array.isArray(rawScene?.options) ? rawScene.options : []
  const usedIds = new Set<string>()

  const normalizedOptions: Choice[] = rawOptions
    .slice(0, MAX_OPTIONS)
    .map((option, index) => {
      let id = normalizeText(option?.id, `option_${index}`)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
      if (usedIds.has(id)) id = `${id}_${index}`
      usedIds.add(id)

      return {
        id,
        text: normalizeText(option?.text, `Choice ${index + 1}`).slice(0, 120),
        requirements: normalizeRequirements(option?.requirements),
        effects: normalizeEffects(option?.effects, ownedArtifacts),
      }
    })
    .filter((option) => option.text.length > 0)

  const accessibleOptions = normalizedOptions.filter((option) =>
    canAccessOption(option, character),
  )
  const fallbackOptions = createFallbackOptions()
  const resultOptions = [...accessibleOptions]

  while (resultOptions.length < MIN_OPTIONS) {
    const fallback =
      fallbackOptions[normalizedOptions.length % fallbackOptions.length]
    resultOptions.push(fallback)
  }

  return {
    id: `scene_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    title,
    description,
    options: resultOptions,
  }
}
