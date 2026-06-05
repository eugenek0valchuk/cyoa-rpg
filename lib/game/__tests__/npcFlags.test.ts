import { describe, expect, it } from 'vitest'

import { collectNewNpcFlags } from '../npcFlags'

describe('npcFlags', () => {
  it('collects newly gained run npc flags', () => {
    expect(
      collectNewNpcFlags(
        ['claimed_mask'],
        ['claimed_mask', 'synod_mark'],
        [],
      ),
    ).toEqual(['synod_mark'])
  })

  it('skips flags already recorded this raid', () => {
    expect(
      collectNewNpcFlags(['wax_offered'], ['wax_offered', 'synod_mark'], [
        'wax_offered',
      ]),
    ).toEqual(['synod_mark'])
  })

  it('ignores non-npc flags', () => {
    expect(
      collectNewNpcFlags([], ['return_sigil', 'ash_path_taken'], []),
    ).toEqual([])
  })
})
