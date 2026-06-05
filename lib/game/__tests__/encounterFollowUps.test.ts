import { describe, expect, it } from 'vitest'

import { getSceneById } from '../sceneRegistry'
import { resolveDirectedScene } from '../sceneDirector'
import type { Character, SceneHistoryEntry } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Aldric',
  origin: 'heretic',
  stats: { strength: 5, agility: 5, intelligence: 8 },
  inventory: [],
  sanity: 50,
  corruption: 10,
  flags: [],
}

describe('encounter follow-up routing', () => {
  it('routes wax pilgrim mouth choice through pull-away beat', () => {
    const wax = getSceneById('encounter_wax_pilgrim', {
      character: baseCharacter,
      journalEntries: [],
      visitedSceneIds: new Set(),
    })!

    const mouthChoice = wax.options.find((option) => option.id === 'mouth')!

    const next = resolveDirectedScene(
      wax,
      mouthChoice,
      baseCharacter,
      [],
    )

    expect(next.id).toBe('encounter_wax_pull_away')
  })

  it('routes heretic whisper through dedicated scene', () => {
    const cog = getSceneById('encounter_heretic_cog', {
      character: baseCharacter,
      journalEntries: [],
      visitedSceneIds: new Set(),
    })!

    const whisperChoice = cog.options.find(
      (option) => option.id === 'heretic_whisper_pit',
    )!

    const next = resolveDirectedScene(
      cog,
      whisperChoice,
      baseCharacter,
      [],
    )

    expect(next.id).toBe('encounter_heretic_whisper')
  })

  it('pull-away beat then targets mouth with explicit targetSceneId', () => {
    const pullAway = getSceneById('encounter_wax_pull_away', {
      character: baseCharacter,
      journalEntries: [],
      visitedSceneIds: new Set(),
    })!

    const mouthChoice = pullAway.options.find((option) => option.id === 'mouth')!

    const history: SceneHistoryEntry[] = [
      {
        id: 'encounter_wax_pilgrim',
        title: 'Воск',
        description: 'd',
      },
      {
        id: 'encounter_wax_pull_away',
        title: 'Рука',
        description: 'd',
      },
    ]

    const next = resolveDirectedScene(
      pullAway,
      mouthChoice,
      baseCharacter,
      history,
    )

    expect(next.id).toBe('mouth')
  })
})
