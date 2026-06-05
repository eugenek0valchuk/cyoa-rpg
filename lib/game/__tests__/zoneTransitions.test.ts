import { describe, it, expect } from 'vitest'

import {
  createZoneBridgeScene,
  shouldInsertZoneBridge,
  wrapSceneWithZoneBridge,
} from '../zoneTransitions'
import { getRaidZone } from '../zones'

describe('zoneTransitions', () => {
  it('inserts bridge when crossing into depth zone', () => {
    const visited = new Set<string>()
    const next = {
      id: 'catacombs',
      title: 'Catacombs',
      description: 'd',
      options: [],
    }

    const wrapped = wrapSceneWithZoneBridge(
      next,
      2,
      3,
      10,
      visited,
      getRaidZone,
    )

    expect(wrapped.scene.id).toBe('zone_bridge_surface_depth')
    expect(wrapped.queuedScene?.id).toBe('catacombs')
  })

  it('skips bridge when already visited', () => {
    const visited = new Set(['zone_bridge_surface_depth'])
    const next = {
      id: 'catacombs',
      title: 'Catacombs',
      description: 'd',
      options: [],
    }

    const wrapped = wrapSceneWithZoneBridge(
      next,
      2,
      3,
      10,
      visited,
      getRaidZone,
    )

    expect(wrapped.scene.id).toBe('catacombs')
    expect(wrapped.queuedScene).toBeNull()
  })

  it('creates readable bridge scene', () => {
    const scene = createZoneBridgeScene('surface', 'depth')

    expect(scene?.options).toHaveLength(1)
    expect(shouldInsertZoneBridge('surface', 'depth', new Set())).toBe(true)
  })
})
