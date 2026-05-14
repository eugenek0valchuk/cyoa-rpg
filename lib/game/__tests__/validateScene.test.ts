import { describe, it, expect } from 'vitest'
import { validateScene } from '../validateScene'

describe('validateScene', () => {
  const emptyOwned = new Set<string>()

  it('normalizes valid scene with full data', () => {
    const result = validateScene(
      {
        title: 'The Dark Hall',
        description: 'A long corridor stretches before you.',
        options: [
          { id: 'go_left', text: 'Go left' },
          { id: 'go_right', text: 'Go right' },
        ],
      },
      emptyOwned,
    )

    expect(result.title).toBe('The Dark Hall')
    expect(result.description).toBe('A long corridor stretches before you.')
    expect(result.options).toHaveLength(2)
    expect(result.id).toMatch(/^scene_\d+_/)
  })

  it('falls back to defaults for missing fields', () => {
    const result = validateScene({}, emptyOwned)

    expect(result.title).toBe('Unknown Depths')
    expect(result.description).toBe('The darkness shifts around you.')
    expect(result.options).toHaveLength(2)
  })

  it('fills insufficient options with fallbacks', () => {
    const result = validateScene(
      {
        title: 'Test',
        description: 'Test',
        options: [{ id: 'a', text: 'Solo option' }],
      },
      emptyOwned,
    )

    expect(result.options).toHaveLength(2)
  })

  it('caps options to MAX_OPTIONS', () => {
    const options = Array.from({ length: 10 }, (_, i) => ({
      id: `opt_${i}`,
      text: `Option ${i}`,
    }))

    const result = validateScene(
      { title: 'T', description: 'D', options },
      emptyOwned,
    )

    expect(result.options.length).toBeLessThanOrEqual(4)
  })

  it('normalizes choice ids to lowercase with underscores', () => {
    const result = validateScene(
      {
        title: 'T',
        description: 'D',
        options: [{ id: 'Go-Left!', text: 'Go left' }],
      },
      emptyOwned,
    )

    expect(result.options[0].id).toBe('go_left_')
  })

  it('filters inaccessible options based on character', () => {
    const character = {
      name: 'Test',
      origin: 'hollow' as const,
      stats: { strength: 5, agility: 5, intelligence: 5 },
      inventory: [],
      sanity: 50,
      corruption: 10,
      flags: [],
    }

    const result = validateScene(
      {
        title: 'T',
        description: 'D',
        options: [
          { id: 'a', text: 'A' },
          {
            id: 'b',
            text: 'B',
            requirements: { minCorruption: 50 },
          },
          { id: 'c', text: 'C' },
        ],
      },
      emptyOwned,
      character,
    )

    expect(result.options).toHaveLength(2)
    expect(result.options.every((o) => o.id !== 'b')).toBe(true)
  })

  it('handles non-array options gracefully', () => {
    const result = validateScene(
      { title: 'T', description: 'D', options: 'invalid' as unknown as [] },
      emptyOwned,
    )

    expect(result.options).toHaveLength(2)
  })

  it('sanitizes effects values to valid ranges', () => {
    const result = validateScene(
      {
        title: 'T',
        description: 'D',
        options: [
          {
            id: 'a',
            text: 'A',
            effects: { sanity: -100, corruption: 100 },
          },
          { id: 'b', text: 'B' },
        ],
      },
      emptyOwned,
    )

    expect(result.options[0].effects?.sanity).toBe(-25)
    expect(result.options[0].effects?.corruption).toBe(25)
  })
})
