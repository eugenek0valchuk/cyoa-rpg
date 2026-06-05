import { describe, it, expect } from 'vitest'

import { createStaticScene } from '../createStaticScene'
import { isRaidEndingScene } from '../isRaidEndingScene'

describe('isRaidEndingScene', () => {
  it('detects static endings without options', () => {
    const scene = createStaticScene({
      id: 'reality_collapse',
      title: 'Мир Распускается',
      description: '...',
    })

    expect(isRaidEndingScene(scene)).toBe(true)
  })

  it('returns false for normal scenes', () => {
    expect(isRaidEndingScene({ id: 'mouth', title: 'M', description: 'd', options: [{ id: 'a', text: 'b' }] })).toBe(false)
  })
})
