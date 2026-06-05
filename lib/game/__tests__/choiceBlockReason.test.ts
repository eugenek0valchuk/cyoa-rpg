import { describe, it, expect } from 'vitest'

import { getChoiceBlockReason } from '../choiceBlockReason'
import type { Character, Choice } from '@/lib/types/game'

const baseCharacter: Character = {
  name: 'Test',
  origin: 'witness',
  stats: { strength: 3, agility: 4, intelligence: 4 },
  inventory: [],
  sanity: 90,
  corruption: 10,
  flags: [],
}

describe('getChoiceBlockReason', () => {
  it('returns null for available choices', () => {
    const choice: Choice = {
      id: 'ok',
      text: 'OK',
      requirements: { agility: 4 },
    }

    expect(getChoiceBlockReason(choice, baseCharacter)).toBeNull()
  })

  it('explains low intelligence', () => {
    const choice: Choice = {
      id: 'read',
      text: 'Read',
      requirements: { intelligence: 6 },
    }

    expect(getChoiceBlockReason(choice, baseCharacter)).toEqual({
      kind: 'intelligence',
      need: 6,
      have: 4,
    })
  })

  it('explains low agility', () => {
    const choice: Choice = {
      id: 'crawl',
      text: 'Crawl',
      requirements: { agility: 5 },
    }

    expect(getChoiceBlockReason(choice, baseCharacter)).toEqual({
      kind: 'agility',
      need: 5,
      have: 4,
    })
  })
})
