import { describe, expect, it } from 'vitest'

import { getLoreCard } from '../loreCards'

describe('loreCards', () => {
  it('returns faction cards', () => {
    expect(getLoreCard('synod')?.title).toBe('Синод под Вуалью')
    expect(getLoreCard('missing')).toBeNull()
  })
})
