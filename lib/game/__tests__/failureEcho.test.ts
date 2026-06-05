import { describe, expect, it } from 'vitest'

import { calcEchoFromFailure } from '../hubMeta'

describe('calcEchoFromFailure', () => {
  it('grants at least 1 echo for any depth', () => {
    expect(calcEchoFromFailure(1, false)).toBeGreaterThanOrEqual(1)
  })

  it('bonuses first failure and deep collapse', () => {
    expect(calcEchoFromFailure(6, true)).toBeGreaterThan(calcEchoFromFailure(6, false))
    expect(calcEchoFromFailure(2, true)).toBeGreaterThan(calcEchoFromFailure(2, false))
  })
})
