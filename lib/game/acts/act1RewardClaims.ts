import { ACT1_QUEST_STEPS } from '@/lib/game/acts/act1Quests'
import { applyActQuestReward } from '@/lib/game/acts/act1Rewards'
import { act1RewardClaims } from '@/locales/ru/acts/act1RewardClaims'
import type { ActQuestReward, ActQuestStepDef } from '@/lib/game/acts/types'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

export function hasActQuestReward(reward: ActQuestReward | undefined): boolean {
  if (!reward) {
    return false
  }

  return Boolean(
    reward.echo ||
      reward.journalEntries?.length ||
      reward.flags?.length ||
      (reward.materials &&
        Object.values(reward.materials).some((count) => (count ?? 0) > 0)),
  )
}

export function getPendingRewardSteps(hub: HubState): string[] {
  const pending = hub.act1?.pendingRewardStepIds ?? []
  const order = new Map(
    ACT1_QUEST_STEPS.map((step, index) => [step.id, index]),
  )

  return [...pending].sort(
    (a, b) => (order.get(a) ?? 999) - (order.get(b) ?? 999),
  )
}

export function countPendingRewardSteps(hub: HubState): number {
  return getPendingRewardSteps(hub).length
}

/** Старые сейвы: награда уже применена (журнал/флаги), но полка ещё не отмечена. */
export function rewardAlreadyApplied(
  hub: HubState,
  character: Character,
  step: ActQuestStepDef,
): boolean {
  const reward = step.reward
  if (!reward) {
    return false
  }

  const journal = new Set(hub.journalEntries ?? [])
  const flags = new Set(character.flags ?? [])
  const hasJournal = (reward.journalEntries?.length ?? 0) > 0
  const hasFlags = (reward.flags?.length ?? 0) > 0

  if (hasJournal || hasFlags) {
    const journalDone =
      !hasJournal ||
      reward.journalEntries!.every((entry) => journal.has(entry))
    const flagsDone =
      !hasFlags || reward.flags!.every((flag) => flags.has(flag))

    return journalDone && flagsDone
  }

  return false
}

export function isStepRewardPending(hub: HubState, stepId: string): boolean {
  return getPendingRewardSteps(hub).includes(stepId)
}

/** Выполненные шаги с наградой, ещё не забранные с полки. */
export function syncAct1PendingRewards(
  hub: HubState,
  character?: Character,
): HubState {
  if (!hub.act1) {
    return hub
  }

  const pending = new Set(hub.act1.pendingRewardStepIds ?? [])
  const claimed = new Set(hub.act1.claimedRewardStepIds ?? [])
  let changed = false

  for (const stepId of hub.act1.completedStepIds) {
    const step = ACT1_QUEST_STEPS.find((entry) => entry.id === stepId)
    if (!step || !hasActQuestReward(step.reward) || claimed.has(stepId)) {
      continue
    }

    if (character && rewardAlreadyApplied(hub, character, step)) {
      claimed.add(stepId)
      pending.delete(stepId)
      changed = true
      continue
    }

    if (!pending.has(stepId)) {
      pending.add(stepId)
      changed = true
    }
  }

  if (!changed) {
    return hub
  }

  return {
    ...hub,
    act1: {
      ...hub.act1,
      pendingRewardStepIds: [...pending],
      claimedRewardStepIds: [...claimed],
    },
  }
}

export function getAct1RewardClaimMessage(stepId: string): string {
  return act1RewardClaims[stepId] ?? 'Хронист выложил на полку то, что камера бережёт между спусками.'
}

export function claimAct1StepReward(
  hub: HubState,
  character: Character,
  stepId: string,
): { hub: HubState; character: Character; message: string } | null {
  const step = ACT1_QUEST_STEPS.find((entry) => entry.id === stepId)
  const pending = hub.act1?.pendingRewardStepIds ?? []

  if (!step || !hasActQuestReward(step.reward) || !pending.includes(stepId)) {
    return null
  }

  const applied = applyActQuestReward(hub, character, step.reward)
  const act1 = applied.hub.act1

  if (!act1) {
    return null
  }

  return {
    hub: {
      ...applied.hub,
      act1: {
        ...act1,
        pendingRewardStepIds: pending.filter((id) => id !== stepId),
        claimedRewardStepIds: [...(act1.claimedRewardStepIds ?? []), stepId],
      },
    },
    character: applied.character,
    message: getAct1RewardClaimMessage(stepId),
  }
}

export function rewardIncludesMaterials(stepId: string): boolean {
  const step = ACT1_QUEST_STEPS.find((entry) => entry.id === stepId)
  if (!step?.reward?.materials) {
    return false
  }

  return Object.values(step.reward.materials).some((count) => (count ?? 0) > 0)
}
