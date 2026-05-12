import { artifacts } from '@/lib/game/artifacts'

const MAX_OPTIONS = 4
const MIN_OPTIONS = 2

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== 'string') {
    return fallback
  }

  const cleaned = value.trim()

  return cleaned.length > 0 ? cleaned : fallback
}

function normalizeRequirements(requirements: any) {
  if (!requirements || typeof requirements !== 'object') {
    return undefined
  }

  const normalized: Record<string, any> = {}

  if (
    typeof requirements.minCorruption === 'number' &&
    Number.isFinite(requirements.minCorruption)
  ) {
    normalized.minCorruption = Math.max(
      0,
      Math.min(100, Math.round(requirements.minCorruption)),
    )
  }

  if (
    typeof requirements.maxSanity === 'number' &&
    Number.isFinite(requirements.maxSanity)
  ) {
    normalized.maxSanity = Math.max(
      0,
      Math.min(100, Math.round(requirements.maxSanity)),
    )
  }

  if (typeof requirements.requiredFlag === 'string') {
    normalized.requiredFlag = requirements.requiredFlag
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
  }

  if (
    typeof requirements.requiredArtifact === 'string' &&
    artifacts[requirements.requiredArtifact]
  ) {
    normalized.requiredArtifact = requirements.requiredArtifact
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

function normalizeEffects(effects: any, ownedArtifacts: Set<string>) {
  const normalized: Record<string, any> = {}

  if (typeof effects?.sanity === 'number' && Number.isFinite(effects.sanity)) {
    normalized.sanity = Math.max(-25, Math.min(25, Math.round(effects.sanity)))
  }

  if (
    typeof effects?.corruption === 'number' &&
    Number.isFinite(effects.corruption)
  ) {
    normalized.corruption = Math.max(
      -25,
      Math.min(25, Math.round(effects.corruption)),
    )
  }

  if (typeof effects?.addFlag === 'string') {
    normalized.addFlag = effects.addFlag
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
  }

  if (
    typeof effects?.addArtifact === 'string' &&
    artifacts[effects.addArtifact] &&
    !ownedArtifacts.has(effects.addArtifact)
  ) {
    normalized.addArtifact = effects.addArtifact
  }

  return normalized
}

function createFallbackOptions() {
  return [
    {
      id: 'continue_forward',

      text: 'Continue deeper into the abyss',

      effects: {
        sanity: -3,
      },
    },

    {
      id: 'observe',

      text: 'Remain still and listen to the dark',

      effects: {},
    },
  ]
}

export function validateScene(rawScene: any, ownedArtifacts: Set<string>) {
  const title = normalizeText(rawScene?.title, 'Unknown Depths').slice(0, 80)

  const description = normalizeText(
    rawScene?.description,
    'The darkness shifts around you.',
  ).slice(0, 2200)

  const rawOptions = Array.isArray(rawScene?.options) ? rawScene.options : []

  const usedIds = new Set<string>()

  const normalizedOptions = rawOptions
    .slice(0, MAX_OPTIONS)
    .map((option: any, index: number) => {
      let id = normalizeText(option?.id, `option_${index}`)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')

      if (usedIds.has(id)) {
        id = `${id}_${index}`
      }

      usedIds.add(id)

      return {
        id,

        text: normalizeText(option?.text, `Choice ${index + 1}`).slice(0, 120),

        requirements: normalizeRequirements(option?.requirements),

        effects: normalizeEffects(option?.effects || {}, ownedArtifacts),
      }
    })
    .filter((option: any) => option.text.length > 0)

  while (normalizedOptions.length < MIN_OPTIONS) {
    const fallback = createFallbackOptions()[normalizedOptions.length]

    normalizedOptions.push(fallback)
  }

  return {
    id: `scene_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,

    title,

    description,

    options: normalizedOptions,
  }
}
