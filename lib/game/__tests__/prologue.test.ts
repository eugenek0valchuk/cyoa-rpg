import { describe, expect, it } from 'vitest'

import { buildPrologueSlides } from '../prologue'

describe('buildPrologueSlides', () => {
  it('includes chamber and road on first raid', () => {
    const slides = buildPrologueSlides({
      origin: 'hollow',
      roomImage: '/rooms/hollow-chamber.png',
      modifierId: 'muted_bells',
      contractId: null,
      isFirstRaid: true,
    })

    expect(slides.map((slide) => slide.id)).toEqual([
      'chamber',
      'modifier_muted_bells',
      'contract',
      'road',
    ])
  })

  it('skips chamber and road on repeat raids', () => {
    const slides = buildPrologueSlides({
      origin: 'witness',
      roomImage: '/rooms/witness-chamber.png',
      modifierId: 'blood_mist',
      contractId: 'vow_first_threshold',
      isFirstRaid: false,
    })

    expect(slides.map((slide) => slide.id)).toEqual([
      'modifier_blood_mist',
      'contract',
    ])
    expect(slides[1]?.body).toContain('Первый порог')
  })
})
