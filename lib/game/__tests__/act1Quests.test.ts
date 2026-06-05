import { describe, expect, it } from 'vitest'

import {
  boostPoolForActQuest,
  evaluateAct1Progress,
  getAct1StepViews,
} from '@/lib/game/acts/questEngine'
import type { Character } from '@/lib/types/game'
import { createInitialHubState } from '@/lib/types/hub'

function witnessCharacter(flags: string[] = []): Character {
  return {
    name: 'Test',
    origin: 'witness',
    stats: { strength: 10, dexterity: 10, intelligence: 10, wisdom: 10 },
    sanity: 50,
    corruption: 10,
    flags,
    inventory: [],
  }
}

describe('act1 quest engine', () => {
  it('reveals first main step for witness at start', () => {
    const hub = createInitialHubState()
    const character = witnessCharacter()
    const updated = evaluateAct1Progress(hub, character)
    const views = getAct1StepViews(updated, character)
    const first = views.find((step) => step.id === 'w_main_1')

    expect(first?.revealed).toBe(true)
    expect(first?.completed).toBe(false)
  })

  it('completes extraction step after first return', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = witnessCharacter()
    const updated = evaluateAct1Progress(hub, character)
    const views = getAct1StepViews(updated, character)

    expect(views.find((step) => step.id === 'w_main_1')?.completed).toBe(true)
    expect(views.find((step) => step.id === 'w_main_2')?.revealed).toBe(true)
  })

  it('boosts act scene when step is active', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = witnessCharacter()
    const evaluated = evaluateAct1Progress(hub, character)
    const pool = ['mouth', 'act1_witness_merchant_oath', 'descent']
    const boosted = boostPoolForActQuest(
      pool,
      evaluated,
      character,
      new Set<string>(),
    )

    expect(boosted).toContain('act1_witness_merchant_oath')
  })

  it('marks act complete after finale scene', () => {
    let hub = {
      ...createInitialHubState(),
      totalExtractions: 2,
      bestDepth: 4,
    }
    const character = witnessCharacter([
      'met_breathless',
      'heard_the_bell',
      'witness_act1_named',
    ])

    hub = evaluateAct1Progress(hub, character, ['act1_witness_finale'])

    expect(hub.act1?.finaleSeen).toBe(true)
    expect(hub.act1?.actComplete).toBe(true)
    expect(hub.journalEntries).toContain('act1_witness')
  })
})
