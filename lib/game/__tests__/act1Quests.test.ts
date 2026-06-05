import { describe, expect, it } from 'vitest'

import {
  boostPoolForActQuest,
  evaluateAct1ProgressWithEvents,
  getAct1StepViews,
  getPendingAct1Scene,
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

function hollowCharacter(flags: string[] = []): Character {
  return {
    name: 'Test',
    origin: 'hollow',
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
    const updated = evaluateAct1ProgressWithEvents(hub, character).hub
    const views = getAct1StepViews(updated, character)
    const first = views.find((step) => step.id === 'w_main_1')

    expect(first?.revealed).toBe(true)
    expect(first?.completed).toBe(false)
  })

  it('completes first step only after act scene, not extraction alone', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = witnessCharacter()
    const withoutScene = evaluateAct1ProgressWithEvents(hub, character).hub
    const viewsWithout = getAct1StepViews(withoutScene, character)

    expect(viewsWithout.find((step) => step.id === 'w_main_1')?.completed).toBe(
      false,
    )

    const withScene = evaluateAct1ProgressWithEvents(
      hub,
      character,
      ['act1_witness_reminder'],
    ).hub
    const viewsWith = getAct1StepViews(withScene, character)

    expect(viewsWith.find((step) => step.id === 'w_main_1')?.completed).toBe(true)
    expect(viewsWith.find((step) => step.id === 'w_main_2')?.revealed).toBe(true)
  })

  it('grants echo reward on step completion', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = witnessCharacter()
    const result = evaluateAct1ProgressWithEvents(hub, character, [
      'act1_witness_reminder',
    ])

    expect(result.hub.echo).toBe(1)
  })

  it('boosts act scene when step is active', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = witnessCharacter()
    const evaluated = evaluateAct1ProgressWithEvents(hub, character, [
      'act1_witness_reminder',
    ]).hub
    const pool = ['mouth', 'act1_witness_merchant_oath', 'descent']
    const boosted = boostPoolForActQuest(
      pool,
      evaluated,
      character,
      new Set<string>(),
    )

    expect(boosted).toContain('act1_witness_merchant_oath')
  })

  it('injects pending act scene at raid start for hollow', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = hollowCharacter()
    const evaluated = evaluateAct1ProgressWithEvents(hub, character).hub

    expect(
      getPendingAct1Scene(evaluated, character, new Set<string>()),
    ).toBe('act1_hollow_empty_chapel')
  })

  it('marks act complete after finale scene', () => {
    let hub = {
      ...createInitialHubState(),
      totalExtractions: 2,
      bestDepth: 4,
    }
    const character = witnessCharacter(['witness_act1_named'])

    hub = evaluateAct1ProgressWithEvents(hub, character, [
      'act1_witness_reminder',
      'act1_witness_merchant_oath',
      'act1_witness_bell_covenant',
      'act1_witness_synod_depth',
      'act1_witness_finale',
    ]).hub

    expect(hub.act1?.finaleSeen).toBe(true)
    expect(hub.act1?.actComplete).toBe(true)
    expect(hub.journalEntries).toContain('act1_witness')
  })
})
