import { describe, expect, it } from 'vitest'

import { buildPrologueSlides } from '../prologue'

describe('buildPrologueSlides', () => {
  it('returns only modifier slide when present', () => {
    const slides = buildPrologueSlides({
      modifierId: 'muted_bells',
    })

    expect(slides).toHaveLength(1)
    expect(slides[0]?.id).toBe('modifier_muted_bells')
  })

  it('returns empty when no modifier', () => {
    expect(buildPrologueSlides({ modifierId: null })).toEqual([])
  })
})
