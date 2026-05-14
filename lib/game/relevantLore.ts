import type { Scene, SceneHistoryEntry } from '../types/game'

import { lore } from './lore'

interface GetRelevantLoreParams {
  currentScene: Scene
  corruption: number
  flags: string[]
  history: SceneHistoryEntry[]
}

export function getRelevantLore({
  currentScene,
  corruption,
  flags,
  history,
}: GetRelevantLoreParams) {
  const text = `${currentScene.title} ${currentScene.description}`.toLowerCase()

  const chunks: string[] = []

  chunks.push(`
CURRENT THEMES:
- decay
- religious horror
- abyss
- silence
`)

  if (text.includes('bell')) {
    chunks.push(...lore.entities.slice(0, 2))
  }

  if (text.includes('cathedral')) {
    chunks.push(...lore.regions.slice(0, 1))
  }

  if (text.includes('saint')) {
    chunks.push(...lore.factions.slice(0, 1))
  }

  if (corruption >= 25) {
    chunks.push(`
WHISPERS EMERGING:
- bells sound beneath reality
- shadows mimic prayer
- blind figures appear more often
`)
  }

  if (corruption >= 50) {
    chunks.push(`
REALITY IS BREAKING:
- architecture mutates
- time fractures
- flesh responds to sound
`)
  }

  if (corruption >= 75) {
    chunks.push(`
ABYSSAL ASCENSION:
- the world is collapsing
- identities dissolve
- ancient entities awaken
`)
  }

  if (flags.includes('lost_in_abysmal_hush')) {
    chunks.push(`
SPECIAL STATE:
The player is spiritually lost within the abyssal hush.
Scenes should feel disoriented and recursive.
`)
  }

  const recentTitles = history
    .slice(-5)
    .map((scene) => scene.title)
    .join(', ')

  chunks.push(`
RECENT SCENES:
${recentTitles || 'none'}
`)

  return chunks.join('\n')
}
