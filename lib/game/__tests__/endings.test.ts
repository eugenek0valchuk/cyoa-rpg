import { describe, it, expect } from 'vitest'
import { getEnding } from '../endings'

describe('getEnding', () => {
  it('returns abyssal_ascension when corruption >= 100', () => {
    const result = getEnding(50, 100)

    expect(result).not.toBeNull()
    expect(result?.id).toBe('abyssal_ascension')
  })

  it('returns madness when sanity <= 0', () => {
    const result = getEnding(0, 50)

    expect(result).not.toBeNull()
    expect(result?.id).toBe('madness')
  })

  it('returns null for normal stats', () => {
    const result = getEnding(50, 50)

    expect(result).toBeNull()
  })

  it('prefers corruption ending over sanity ending', () => {
    const result = getEnding(0, 100)

    expect(result?.id).toBe('abyssal_ascension')
  })

  it('returns null at boundary values', () => {
    expect(getEnding(1, 99)).toBeNull()
    expect(getEnding(100, 0)).toBeNull()
  })
})
