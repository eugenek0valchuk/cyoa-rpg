import { describe, it, expect } from 'vitest'

import {
  canExtractRaid,
  getExtractBlockReason,
  isAtExtractionSite,
} from '../extraction'
import { MIN_EXTRACT_DEPTH } from '@/lib/types/hub'
import type { Character } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 5, agility: 5, intelligence: 5 },
  inventory: [],
  sanity: 50,
  corruption: 20,
  flags: [],
}

const activeRaid = {
  active: true,
  depth: 4,
  inventoryAtStart: [] as string[],
}

describe('extraction site conditions', () => {
  it('detects when player stands on an exit site', () => {
    expect(isAtExtractionSite('exit_monastery', [])).toBe(true)
    expect(isAtExtractionSite('mouth', ['return_sigil'])).toBe(true)
    expect(isAtExtractionSite('descent', [])).toBe(false)
  })

  it('blocks monastery exit when sanity is too low', () => {
    const lowSanity = { ...baseCharacter, sanity: 10 }

    expect(
      getExtractBlockReason(activeRaid, [], 'exit_monastery', lowSanity),
    ).toBe('need_sanity')
    expect(
      canExtractRaid(activeRaid, [], 'exit_monastery', lowSanity),
    ).toBe(false)
  })

  it('blocks ash_path until depth 3', () => {
    const shallowRaid = { ...activeRaid, depth: 2 }

    expect(
      getExtractBlockReason(shallowRaid, [], 'ash_path', baseCharacter),
    ).toBe('need_site_depth')
  })

  it('blocks drain_water until depth 4 and minimum sanity', () => {
    const depthThree = { ...activeRaid, depth: 3 }

    expect(
      getExtractBlockReason(depthThree, [], 'drain_water', baseCharacter),
    ).toBe('need_site_depth')

    const tired = { ...baseCharacter, sanity: 8 }
    expect(
      getExtractBlockReason(activeRaid, [], 'drain_water', tired),
    ).toBe('need_sanity')
  })

  it('requires met_breathless for sigil extract at merchant', () => {
    const flags = ['return_sigil']

    expect(
      getExtractBlockReason(activeRaid, flags, 'merchant', baseCharacter),
    ).toBe('need_flag')

    const known = {
      ...baseCharacter,
      flags: ['met_breathless'],
    }

    expect(
      getExtractBlockReason(activeRaid, flags, 'merchant', known),
    ).toBe('available')
  })

  it('blocks sigil extract at start when corruption is too high', () => {
    const flags = ['return_sigil']
    const corrupt = { ...baseCharacter, corruption: 85 }

    expect(
      getExtractBlockReason(activeRaid, flags, 'start', corrupt),
    ).toBe('too_corrupt')
  })

  it('still enforces global minimum depth before site rules', () => {
    const shallowRaid = {
      ...activeRaid,
      depth: MIN_EXTRACT_DEPTH - 1,
    }

    expect(
      getExtractBlockReason(shallowRaid, [], 'exit_monastery', baseCharacter),
    ).toBe('need_depth')
  })
})
