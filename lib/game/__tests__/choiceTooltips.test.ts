import { describe, it, expect } from 'vitest'

import { getEffectTooltip, getRequirementTooltip } from '../choiceTooltips'

describe('choice tooltips', () => {
  it('describes sanity loss on choice', () => {
    const tip = getEffectTooltip('sanity', -5)

    expect(tip.title).toContain('Рассудок')
    expect(tip.body).toContain('-5')
    expect(tip.body).toContain('после')
  })

  it('describes unmet strength requirement', () => {
    const tip = getRequirementTooltip('strength', 7, 5)

    expect(tip.title).toContain('Сила')
    expect(tip.body).toContain('не хватает')
  })
})
