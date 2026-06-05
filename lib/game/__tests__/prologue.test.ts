import { describe, expect, it } from 'vitest'

import { buildPrologueSlides } from '../prologue'

describe('buildPrologueSlides', () => {
  it('always includes chamber and road slides', () => {
    const slides = buildPrologueSlides({
      modifierId: null,
      contractId: null,
    })

    expect(slides.map((slide) => slide.id)).toEqual([
      'chamber',
      'road',
      'contract_none',
    ])
  })

  it('includes contract and modifier slides when present', () => {
    const slides = buildPrologueSlides({
      modifierId: 'muted_bells',
      contractId: 'vow_surface_breath',
    })

    expect(slides[2]?.id).toBe('contract_vow_surface_breath')
    expect(slides[3]?.id).toBe('modifier_muted_bells')
  })
})
