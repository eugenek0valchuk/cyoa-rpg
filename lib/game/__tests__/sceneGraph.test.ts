import { describe, it, expect } from 'vitest'

import {
  buildSceneAdjacency,
  canNavigateOnMap,
  getNeighbors,
  getSceneMapNodes,
} from '../sceneGraph'
import { resolveMapNavigation } from '../navigateScene'

import type { Character } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 50,
  corruption: 10,
  flags: [],
}

describe('sceneGraph', () => {
  it('links spine scenes bidirectionally', () => {
    const neighbors = getNeighbors('mouth')

    expect(neighbors).toContain('start')
    expect(neighbors).toContain('descent')
    expect(getNeighbors('start')).toContain('mouth')
  })

  it('marks exit sites on map nodes', () => {
    const exits = getSceneMapNodes()
      .filter((node) => node.isExit)
      .map((node) => node.id)

    expect(exits).toContain('exit_monastery')
    expect(exits).toContain('drain_water')
  })

  it('allows map navigation only to visited neighbors', () => {
    const visited = new Set(['start', 'mouth', 'descent'])

    expect(canNavigateOnMap('mouth', 'start', visited)).toBe(true)
    expect(canNavigateOnMap('mouth', 'descent', visited)).toBe(true)
    expect(canNavigateOnMap('mouth', 'monastery', visited)).toBe(false)
  })

  it('rewinds history when navigating back', () => {
    const resolved = resolveMapNavigation(
      'descent',
      'mouth',
      [
        { id: 'start', title: 'A', description: 'a' },
        { id: 'mouth', title: 'B', description: 'b' },
      ],
      baseCharacter,
      [],
    )

    expect(resolved?.nextScene.id).toBe('mouth')
    expect(resolved?.rewindToIndex).toBe(1)
  })

  it('builds adjacency for all registry targets', () => {
    const adjacency = buildSceneAdjacency()

    expect(adjacency.size).toBeGreaterThan(40)
    expect(adjacency.get('bell')?.has('exit_monastery')).toBe(true)
  })
})
