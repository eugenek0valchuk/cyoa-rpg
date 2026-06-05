import { describe, it, expect } from 'vitest'

import {
  applyRaidModifierTick,
  pickRaidModifier,
  RAID_MODIFIERS,
} from '../raidModifiers'

describe('raid modifiers', () => {
  it('picks a known modifier id', () => {
    const id = pickRaidModifier(42)
    expect(RAID_MODIFIERS[id]).toBeDefined()
  })

  it('picks only harsh modifiers when failure stain is active', () => {
    const id = pickRaidModifier(42, { harshOnly: true })
    expect(['blood_mist', 'hollow_wind']).toContain(id)
  })

  it('applies muted bells sanity drain', () => {
    const result = applyRaidModifierTick(
      {
        name: 'Test',
        origin: 'hollow',
        stats: { strength: 5, agility: 5, intelligence: 5 },
        inventory: [],
        sanity: 50,
        corruption: 10,
        flags: [],
      },
      'muted_bells',
    )

    expect(result.sanity).toBe(49)
    expect(result.corruption).toBe(10)
  })
})
