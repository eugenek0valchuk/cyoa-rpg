import { describe, expect, it } from 'vitest'

import {
  claimAct1StepReward,
  getPendingRewardSteps,
  rewardAlreadyApplied,
  syncAct1PendingRewards,
} from '@/lib/game/acts/act1RewardClaims'
import { evaluateAct1ProgressWithEvents } from '@/lib/game/acts/questEngine'
import type { Character } from '@/lib/types/game'
import { createInitialHubState } from '@/lib/types/hub'

function witnessCharacter(): Character {
  return {
    name: 'Test',
    origin: 'witness',
    stats: { strength: 10, agility: 10, intelligence: 10 },
    sanity: 50,
    corruption: 10,
    flags: [],
    inventory: [],
  }
}

describe('act1 reward claims', () => {
  it('queues reward on step complete instead of applying immediately', () => {
    const hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = witnessCharacter()
    const result = evaluateAct1ProgressWithEvents(hub, character, [
      'act1_witness_reminder',
    ])

    expect(result.hub.echo ?? 0).toBe(0)
    expect(getPendingRewardSteps(result.hub)).toContain('w_main_1')
  })

  it('sorts pending rewards by quest order', () => {
    const base = createInitialHubState()
    const hub = {
      ...base,
      act1: {
        ...base.act1!,
        pendingRewardStepIds: ['w_main_3', 'w_main_1', 'w_main_2'],
      },
    }

    expect(getPendingRewardSteps(hub)).toEqual([
      'w_main_1',
      'w_main_2',
      'w_main_3',
    ])
  })

  it('applies reward when claimed from shelf', () => {
    let hub = { ...createInitialHubState(), totalExtractions: 1 }
    const character = witnessCharacter()
    hub = evaluateAct1ProgressWithEvents(hub, character, [
      'act1_witness_reminder',
    ]).hub

    const claimed = claimAct1StepReward(hub, character, 'w_main_1')
    expect(claimed).not.toBeNull()
    expect(claimed!.hub.echo).toBe(1)
    expect(getPendingRewardSteps(claimed!.hub)).toHaveLength(0)
    expect(claimed!.hub.act1?.claimedRewardStepIds).toContain('w_main_1')
  })

  it('backfills claimed when journal reward was already applied', () => {
    const base = createInitialHubState()
    const character = witnessCharacter()
    const hub = {
      ...base,
      totalExtractions: 1,
      echo: 1,
      act1: {
        ...base.act1!,
        completedStepIds: ['w_main_5'],
        pendingRewardStepIds: ['w_main_5'],
        claimedRewardStepIds: [],
      },
      journalEntries: ['act1_witness'],
    }

    const synced = syncAct1PendingRewards(hub, character)

    expect(synced.act1?.claimedRewardStepIds).toContain('w_main_5')
    expect(getPendingRewardSteps(synced)).not.toContain('w_main_5')
  })

  it('detects journal reward already applied on finale step', () => {
    const hub = {
      ...createInitialHubState(),
      journalEntries: ['act1_witness'],
    }
    const character = witnessCharacter()

    expect(rewardAlreadyApplied(hub, character, {
      id: 'w_main_5',
      origin: 'witness',
      type: 'main',
      order: 5,
      titleHidden: '',
      titleRevealed: '',
      hint: '',
      completeWhen: { kind: 'finale', sceneId: 'act1_witness_finale' },
      reward: { echo: 5, journalEntries: ['act1_witness'] },
    })).toBe(true)
  })
})
