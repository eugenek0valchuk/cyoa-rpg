import { describe, it, expect } from 'vitest'

import { getRaidZone } from '../zones'

describe('raid zones', () => {
  it('maps shallow depth to surface', () => {
    expect(getRaidZone(0)).toBe('surface')
    expect(getRaidZone(2)).toBe('surface')
  })

  it('maps mid depth to depth and fracture', () => {
    expect(getRaidZone(3)).toBe('depth')
    expect(getRaidZone(5)).toBe('depth')
    expect(getRaidZone(6)).toBe('fracture')
  })

  it('maps deep runs and high corruption to collapse', () => {
    expect(getRaidZone(9)).toBe('collapse')
    expect(getRaidZone(4, 75)).toBe('collapse')
  })
})
