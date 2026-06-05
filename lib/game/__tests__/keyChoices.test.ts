import { describe, expect, it } from 'vitest'

import { getKeyChoiceMeta, isKeyChoice } from '../keyChoices'
import type { Choice } from '@/lib/types/game'

function choice(id: string, partial?: Partial<Choice>): Choice {
  return { id, text: id, ...partial }
}

describe('keyChoices', () => {
  it('marks fork at start', () => {
    expect(isKeyChoice('start', choice('monastery'))).toBe(true)
    expect(getKeyChoiceMeta('start', choice('mouth'))?.id).toBe('fork_mouth')
  })

  it('marks bell and catacombs descent', () => {
    expect(getKeyChoiceMeta('monastery', choice('bell'))?.id).toBe('bell_touch')
    expect(getKeyChoiceMeta('bell', choice('catacombs'))?.id).toBe(
      'catacombs_descent',
    )
  })

  it('ignores non-pivot choices', () => {
    expect(isKeyChoice('start', choice('merchant'))).toBe(false)
    expect(isKeyChoice('bell', choice('exit_monastery'))).toBe(false)
  })
})
