import { describe, it, expect } from 'vitest'

import { detectSceneLoop } from '../loopDetection'
import type { Scene, SceneHistoryEntry } from '@/lib/types/game'

describe('detectSceneLoop', () => {
  const history: SceneHistoryEntry[] = [
    {
      id: '1',
      title: 'The Ash Hall',
      description: 'Ash drifts through broken arches as bells echo below.',
    },
    {
      id: '2',
      title: 'The Veiled Stair',
      description: 'Stone steps descend into a corridor lined with blind saints.',
    },
  ]

  it('detects repeated titles', () => {
    const scene: Scene = {
      id: '3',
      title: 'The Ash Hall',
      description: 'Something entirely different happens here.',
      options: [],
    }

    expect(detectSceneLoop(scene, history)).toBe(true)
  })

  it('detects highly similar descriptions', () => {
    const scene: Scene = {
      id: '3',
      title: 'New Location',
      description:
        'Ash drifts through broken arches while distant bells echo below the stone.',
      options: [],
    }

    expect(detectSceneLoop(scene, history)).toBe(true)
  })

  it('allows distinct scenes', () => {
    const scene: Scene = {
      id: '3',
      title: 'The Iron Well',
      description: 'Rust blooms across chains suspended over a bottomless pit.',
      options: [],
    }

    expect(detectSceneLoop(scene, history)).toBe(false)
  })
})
