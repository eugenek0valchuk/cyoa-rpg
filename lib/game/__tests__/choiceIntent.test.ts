import { describe, it, expect } from 'vitest'

import { inferChoiceIntent } from '../choiceIntent'
import type { Choice } from '@/lib/types/game'

describe('inferChoiceIntent', () => {
  it('marks descent choices as deeper', () => {
    expect(
      inferChoiceIntent({
        id: 'catacombs',
        text: 'Down',
        effects: { corruption: 2, sanity: -3 },
      }),
    ).toBe('deeper')
  })

  it('marks heavy costs as risk', () => {
    expect(
      inferChoiceIntent({
        id: 'submerged_crypt',
        text: 'Dive',
        effects: { corruption: 4, sanity: -5 },
      }),
    ).toBe('risk')
  })

  it('marks retreat exits', () => {
    expect(
      inferChoiceIntent({
        id: 'exit_monastery',
        text: 'Run',
        effects: { sanity: -2 },
      }),
    ).toBe('retreat')
  })

  it('marks lore paths', () => {
    expect(
      inferChoiceIntent({
        id: 'read_writings',
        text: 'Read',
        effects: { sanity: -3 },
      }),
    ).toBe('lore')
  })

  it('marks zone bridge continue as deeper', () => {
    expect(
      inferChoiceIntent({
        id: 'zone_bridge_continue',
        text: 'Continue',
      }),
    ).toBe('deeper')
  })

  it('marks pit_listen as lore not retreat', () => {
    expect(
      inferChoiceIntent({
        id: 'pit_listen',
        text: 'Listen',
        effects: { sanity: -2, corruption: 1 },
      }),
    ).toBe('lore')
  })
})
