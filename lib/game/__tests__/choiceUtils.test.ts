import { describe, it, expect } from 'vitest'

import {
  isChoiceAvailable,
  isChoiceAvailableAfterRiskSuccess,
} from '../choiceUtils'

import type { Character, Choice } from '@/lib/types/game'

const character: Character = {
  name: 'Test',
  origin: 'hollow',
  stats: { strength: 4, agility: 4, intelligence: 4 },
  inventory: [],
  sanity: 50,
  corruption: 20,
  flags: [],
}

const choice: Choice = {
  id: 'blood_path',
  text: 'Cut sample',
  requirements: { strength: 6 },
}

describe('isChoiceAvailableAfterRiskSuccess', () => {
  it('allows choice when only strength blocks', () => {
    expect(isChoiceAvailable(choice, character)).toBe(false)
    expect(isChoiceAvailableAfterRiskSuccess(choice, character)).toBe(true)
  })

  it('still blocks missing flags after risk', () => {
    const flagged: Choice = {
      id: 'split',
      text: 'Listen',
      requirements: { requiredFlag: 'choir_split', strength: 8 },
    }

    expect(isChoiceAvailableAfterRiskSuccess(flagged, character)).toBe(false)
  })
})
