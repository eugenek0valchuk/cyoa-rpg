import { describe, it, expect } from 'vitest'

import { t } from '@/lib/i18n'
import { resolveDirectedScene } from '../sceneDirector'
import type { Character } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'witness',
  stats: { strength: 5, agility: 5, intelligence: 6 },
  inventory: [],
  sanity: 50,
  corruption: 10,
  flags: [],
}

describe('scene option ids', () => {
  it('does not reuse option ids within a single scene', () => {
    for (const scene of Object.values(t.scenes)) {
      const ids = scene.options.map((option) => option.id)
      const unique = new Set(ids)

      expect(unique.size, `duplicate ids in scene "${scene.id}"`).toBe(ids.length)
    }
  })
})

describe('targetSceneId routing', () => {
  it('routes carve_return_sigil to catacombs', () => {
    const scene = t.scenes.read_writings
    const choice = scene.options.find((option) => option.id === 'carve_return_sigil')

    expect(choice).toBeDefined()

    const next = resolveDirectedScene(scene, choice!, baseCharacter, [
      { id: 'read_writings', title: scene.title, description: scene.description },
    ])

    expect(next.id).toBe('catacombs')
  })
})
