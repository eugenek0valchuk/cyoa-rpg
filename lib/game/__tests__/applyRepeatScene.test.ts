import { describe, it, expect } from 'vitest'

import { applyRepeatToScene } from '../applyRepeatScene'
import { getSceneById } from '../sceneRegistry'
import type { Character } from '@/lib/types/game'

function makeCharacter(): Character {
  return {
    name: 'Test',
    origin: 'witness',
    stats: { strength: 5, agility: 5, intelligence: 8 },
    inventory: [],
    sanity: 70,
    corruption: 10,
    flags: [],
  }
}

describe('applyRepeatToScene', () => {
  it('leaves merchant unchanged on first meeting', () => {
    const base = getSceneById('merchant', { character: makeCharacter() })!
    const repeated = applyRepeatToScene(base, {
      character: makeCharacter(),
      journalEntries: [],
      visitedSceneIds: new Set(),
    })

    expect(repeated.title).not.toContain('Помнит')
    expect(
      repeated.options.some((option) => option.id === 'merchant_reunion_trade'),
    ).toBe(false)
  })

  it('shows reunion merchant when breathless is in journal', () => {
    const base = getSceneById('merchant', { character: makeCharacter() })!
    const repeated = applyRepeatToScene(base, {
      character: makeCharacter(),
      journalEntries: ['npc_breathless'],
      visitedSceneIds: new Set(),
    })

    expect(repeated.title).toContain('Помнит')
    expect(repeated.description).toContain('Снова ты')
    expect(
      repeated.options.some((option) => option.id === 'merchant_reunion_trade'),
    ).toBe(true)
  })

  it('shows wax pilgrim reunion with new bargain choice', () => {
    const base = getSceneById('encounter_wax_pilgrim', {
      character: makeCharacter(),
    })!
    const repeated = applyRepeatToScene(base, {
      character: makeCharacter(),
      journalEntries: ['npc_wax'],
      visitedSceneIds: new Set(),
    })

    expect(repeated.title).toContain('Пульсом')
    expect(
      repeated.options.some((option) => option.id === 'wax_reunion_bargain'),
    ).toBe(true)
  })

  it('uses same-run variant when revisited without journal memory', () => {
    const base = getSceneById('merchant', { character: makeCharacter() })!
    const repeated = applyRepeatToScene(base, {
      character: makeCharacter(),
      journalEntries: [],
      visitedSceneIds: new Set(['merchant']),
    })

    expect(repeated.description).toContain('Ты только что был здесь')
  })

  it('resolves follow-up scenes from registry', () => {
    const scene = getSceneById('merchant_reunion', {
      character: makeCharacter(),
    })

    expect(scene?.title).toBe('Слух за Память')
    expect(scene?.options.length).toBeGreaterThan(0)
  })
})
