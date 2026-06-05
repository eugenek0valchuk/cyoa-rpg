import { describe, it, expect } from 'vitest'

import { getRaidFlagEntry, getRaidFlagIds } from '../raidChronicle'

describe('raidChronicle', () => {
  it('returns known flag entries', () => {
    const entry = getRaidFlagEntry('synod_mark')

    expect(entry.label).toBe('Метка Синода')
    expect(entry.gameplay.length).toBeGreaterThan(0)
  })

  it('falls back for unknown flags', () => {
    const entry = getRaidFlagEntry('unknown_test_flag')

    expect(entry.label).toContain('Unknown')
    expect(entry.blurb.length).toBeGreaterThan(0)
  })

  it('deduplicates flag ids', () => {
    expect(getRaidFlagIds(['synod_mark', 'synod_mark', 'wax_offered'])).toEqual([
      'synod_mark',
      'wax_offered',
    ])
  })
})
