import { describe, it, expect, vi } from 'vitest'

import { artifacts } from '../artifacts'
import { handleGameChoice } from '../handleChoice'
import { ZONE_BRIDGE_CONTINUE_ID } from '../zoneTransitions'
import type { Character, Scene, SceneHistoryEntry } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'heretic',
  stats: { strength: 3, agility: 4, intelligence: 8 },
  inventory: [],
  sanity: 50,
  corruption: 10,
  flags: [],
}

const historyAtDepthTwo: SceneHistoryEntry[] = [
  { id: 'start', title: 'Start', description: 'd' },
  { id: 'mouth', title: 'Mouth', description: 'd' },
]

const bellScene: Scene = {
  id: 'bell',
  title: 'Bell',
  description: 'd',
  options: [
    {
      id: 'catacombs',
      text: 'Down',
      effects: { corruption: 4, sanity: -3 },
    },
  ],
}

describe('handleGameChoice', () => {
  it('inserts zone bridge before first depth-zone scene', async () => {
    const setCurrentScene = vi.fn()
    const setQueuedScene = vi.fn()
    const setCharacter = vi.fn()
    const pushSceneHistory = vi.fn()
    const pushHistory = vi.fn()

    await handleGameChoice({
      currentScene: bellScene,
      choice: bellScene.options[0]!,
      character: baseCharacter,
      sceneHistory: historyAtDepthTwo,
      artifacts,
      raidModifierId: 'muted_bells',
      setCharacter,
      setCurrentScene,
      getQueuedScene: () => null,
      setQueuedScene,
      pushSceneHistory,
      pushHistory,
      revealArtifact: async () => {},
    })

    expect(setCurrentScene).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'zone_bridge_surface_depth' }),
    )
    expect(setQueuedScene).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'catacombs' }),
    )
  })

  it('does not drain modifier sanity on bridge continue', async () => {
    const bridgeScene: Scene = {
      id: 'zone_bridge_surface_depth',
      title: 'Bridge',
      description: 'd',
      options: [{ id: ZONE_BRIDGE_CONTINUE_ID, text: 'Go' }],
    }
    const queued: Scene = {
      id: 'catacombs',
      title: 'Catacombs',
      description: 'd',
      options: [],
    }

    const setCharacter = vi.fn()

    await handleGameChoice({
      currentScene: bridgeScene,
      choice: bridgeScene.options[0]!,
      character: { ...baseCharacter, sanity: 40 },
      sceneHistory: [
        ...historyAtDepthTwo,
        { id: 'bell', title: 'Bell', description: 'd' },
        { id: 'zone_bridge_surface_depth', title: 'Bridge', description: 'd' },
      ],
      artifacts,
      raidModifierId: 'muted_bells',
      setCharacter,
      setCurrentScene: vi.fn(),
      getQueuedScene: () => queued,
      setQueuedScene: vi.fn(),
      pushSceneHistory: vi.fn(),
      pushHistory: vi.fn(),
      revealArtifact: async () => {},
    })

    expect(setCharacter).toHaveBeenCalledWith(
      expect.objectContaining({ sanity: 40 }),
    )
  })

  it('clears queued scene when ending triggers', async () => {
    const setQueuedScene = vi.fn()
    const scene: Scene = {
      id: 'pit',
      title: 'Pit',
      description: 'd',
      options: [{ id: 'noop', text: 'Fall' }],
    }

    await handleGameChoice({
      currentScene: scene,
      choice: scene.options[0]!,
      character: { ...baseCharacter, corruption: 100 },
      sceneHistory: [],
      artifacts,
      setCharacter: vi.fn(),
      setCurrentScene: vi.fn(),
      getQueuedScene: () => ({
        id: 'catacombs',
        title: 'Queued',
        description: 'd',
        options: [],
      }),
      setQueuedScene,
      pushSceneHistory: vi.fn(),
      pushHistory: vi.fn(),
      revealArtifact: async () => {},
    })

    expect(setQueuedScene).toHaveBeenCalledWith(null)
  })
})
