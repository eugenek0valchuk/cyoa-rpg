import { describe, it, expect } from 'vitest'

import { scenes } from '../scenes'
import { resolveDirectedScene } from '../sceneDirector'
import type { Character, SceneHistoryEntry } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Aldric',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 50,
  corruption: 10,
  flags: [],
}

describe('resolveDirectedScene', () => {
  it('returns a direct scene for mapped choice ids', () => {
    const scene = resolveDirectedScene(
      scenes.start,
      scenes.start.options[0]!,
      baseCharacter,
      [],
    )

    expect(scene.id).toBe('mouth')
  })

  it('returns event scenes for previously unmapped choices', () => {
    const scene = resolveDirectedScene(
      scenes.iron_passage,
      scenes.iron_passage.options[0]!,
      baseCharacter,
      [],
    )

    expect(scene.id).toBe('stone_path')
    expect(scene.title).toBe('Влажный Склеп')
  })

  it('picks an alternate scene from pool when revisiting', () => {
    const history: SceneHistoryEntry[] = [
      {
        id: 'mouth',
        title: scenes.mouth.title,
        description: scenes.mouth.description,
      },
    ]

    const scene = resolveDirectedScene(
      scenes.start,
      scenes.start.options[0]!,
      baseCharacter,
      history,
    )

    expect(scene.id).not.toBe('mouth')
    expect(['descent_echoes', 'descent_reliquary']).toContain(scene.id)
  })

  it('falls back to phase scenes when no direct mapping exists', () => {
    const scene = resolveDirectedScene(
      scenes.mouth,
      {
        id: 'unknown_choice',
        text: 'Do something impossible',
      },
      { ...baseCharacter, corruption: 85 },
      Array.from({ length: 8 }, (_, index) => ({
        id: `scene_${index}`,
        title: `Visited ${index}`,
        description: 'Already seen.',
      })),
    )

    expect(['collapse_threshold', 'collapse_maw']).toContain(scene.id)
  })

  it('avoids repeating a direct scene already in history', () => {
    const history: SceneHistoryEntry[] = [
      {
        id: 'sarcophagus_tunnel',
        title: 'Вертикальный Склеп',
        description: 'Уже был здесь.',
      },
    ]

    const scene = resolveDirectedScene(
      scenes.submerged_crypt,
      scenes.submerged_crypt.options[0]!,
      baseCharacter,
      history,
    )

    expect(scene.id).not.toBe('sarcophagus_tunnel')
  })
})
