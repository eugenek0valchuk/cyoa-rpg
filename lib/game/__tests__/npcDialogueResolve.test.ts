import { describe, expect, it } from 'vitest'

import {
  resolveNpcChoiceReplyEntry,
  resolveNpcOpeningTiered,
} from '@/locales/ru/npc/dialogue/resolve'
import type { NpcChoiceReplyTiered } from '@/locales/ru/npc/dialogue/types'

describe('npc dialogue resolve', () => {
  it('picks reunion opening when journal matches', () => {
    const opening = resolveNpcOpeningTiered(
      {
        first: ['первый'],
        reunion: ['возвращение'],
      },
      'npc_wax',
      ['npc_wax'],
      'encounter_wax_pilgrim',
      new Set(),
    )

    expect(opening[0]).toBe('возвращение')
  })

  it('picks sameRun reply when scene revisited this raid', () => {
    const tiered: NpcChoiceReplyTiered = {
      first: { player: 'первый', npc: ['а'] },
      sameRun: { player: 'снова', npc: ['б'] },
    }

    const reply = resolveNpcChoiceReplyEntry(
      tiered,
      undefined,
      [],
      'encounter_wax_pilgrim',
      new Set(['encounter_wax_pilgrim']),
    )

    expect(reply.player).toBe('снова')
  })
})
