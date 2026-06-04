import { Scene, SceneHistoryEntry } from '../types/game'

const LOOP_WINDOW = 6
const DESCRIPTION_SIMILARITY_THRESHOLD = 0.6

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenSet(value: string): Set<string> {
  return new Set(
    normalizeText(value)
      .split(' ')
      .filter((token) => token.length > 2),
  )
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = tokenSet(a)
  const setB = tokenSet(b)

  if (setA.size === 0 || setB.size === 0) {
    return 0
  }

  const intersection = [...setA].filter((token) => setB.has(token)).length
  const union = new Set([...setA, ...setB]).size

  return intersection / union
}

export function detectSceneLoop(scene: Scene, history: SceneHistoryEntry[]) {
  const recent = history.slice(-LOOP_WINDOW)
  const normalizedTitle = normalizeText(scene.title)
  const normalizedDescription = normalizeText(scene.description)

  return recent.some((entry) => {
    if (normalizeText(entry.title) === normalizedTitle) {
      return true
    }

    if (
      jaccardSimilarity(entry.description, scene.description) >=
      DESCRIPTION_SIMILARITY_THRESHOLD
    ) {
      return true
    }

    if (
      normalizedDescription.length > 40 &&
      entry.description.slice(0, 120) === scene.description.slice(0, 120)
    ) {
      return true
    }

    return false
  })
}
