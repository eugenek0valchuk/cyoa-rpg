import { describe, it, expect } from 'vitest'

import { applyOriginToScene } from '../applyOriginScene'
import { getSceneById } from '../sceneRegistry'
import type { Character } from '@/lib/types/game'

function makeCharacter(origin: Character['origin']): Character {
  return {
    name: 'Test',
    origin,
    stats: { strength: 5, agility: 5, intelligence: 5 },
    inventory: [],
    sanity: 70,
    corruption: 10,
    flags: [],
  }
}

describe('applyOriginToScene', () => {
  it('prepends hollow voice on the pilgrim road', () => {
    const scene = getSceneById('start')!
    const personalized = applyOriginToScene(scene, makeCharacter('hollow'))

    expect(personalized.description).toContain('голод')
    expect(personalized.options.some((option) => option.id === 'beat_hollow_mask')).toBe(
      false,
    )
  })

  it('offers hollow mask beat when mask is in loadout', () => {
    const scene = getSceneById('start')!
    const personalized = applyOriginToScene(scene, {
      ...makeCharacter('hollow'),
      inventory: [
        {
          id: 'ashen_faceless_mask',
          name: 'Mask',
          rarity: 'rare',
          description: 'mask',
        },
      ],
    })

    expect(
      personalized.options.some((option) => option.id === 'beat_hollow_mask'),
    ).toBe(true)
  })

  it('adds witness bell beat only for witness origin', () => {
    const witness = applyOriginToScene(getSceneById('start')!, makeCharacter('witness'))
    const heretic = applyOriginToScene(getSceneById('start')!, makeCharacter('heretic'))

    expect(witness.options.some((option) => option.id === 'beat_witness_bell')).toBe(
      true,
    )
    expect(heretic.options.some((option) => option.id === 'beat_witness_bell')).toBe(
      false,
    )
  })

  it('hides take_mask at merchant when hollow already carries the mask', () => {
    const scene = getSceneById('merchant')!
    const personalized = applyOriginToScene(scene, {
      ...makeCharacter('hollow'),
      inventory: [
        {
          id: 'ashen_faceless_mask',
          name: 'Mask',
          rarity: 'rare',
          description: 'mask',
        },
      ],
    })

    expect(personalized.options.some((option) => option.id === 'take_mask')).toBe(false)
    expect(personalized.description).toContain('Пустой')
  })

  it('personalizes merchant dialogue for witness', () => {
    const personalized = applyOriginToScene(
      getSceneById('merchant')!,
      makeCharacter('witness'),
    )

    expect(personalized.description).toContain('дороги')
    expect(
      personalized.options.some(
        (option) => option.id === 'mouth' && option.text.includes('видел'),
      ),
    ).toBe(true)
  })
})
