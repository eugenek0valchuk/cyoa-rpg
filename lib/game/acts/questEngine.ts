import { applyActQuestReward } from '@/lib/game/acts/act1Rewards'
import {
  ACT1_FINALE_SCENES,
  ACT1_QUEST_STEPS,
  stepsForOrigin,
} from '@/lib/game/acts/act1Quests'
import type {
  Act1EvaluationResult,
  Act1Progress,
  Act1QuestEvent,
  ActQuestEvaluationContext,
  ActQuestStepView,
  QuestCondition,
} from '@/lib/game/acts/types'
import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

export const ACT1_COMPLETE_FLAG_PREFIX = 'act1_'

export function createInitialAct1Progress(): Act1Progress {
  return {
    completedStepIds: [],
    revealedStepIds: [],
    finaleSeen: false,
    actComplete: false,
  }
}

export function conditionMet(
  condition: QuestCondition,
  ctx: ActQuestEvaluationContext,
): boolean {
  const { hub, characterFlags, visitedSceneIds } = ctx

  switch (condition.kind) {
    case 'extractions':
      return (hub.totalExtractions ?? 0) >= condition.min
    case 'flag':
      return characterFlags.includes(condition.flag)
    case 'journal':
      return (hub.journalEntries ?? []).includes(condition.entryId)
    case 'best_depth':
      return (hub.bestDepth ?? 0) >= condition.min
    case 'scene':
      return visitedSceneIds.has(condition.sceneId)
    case 'finale':
      return (
        visitedSceneIds.has(condition.sceneId) ||
        (hub.act1?.finaleSeen ?? false)
      )
    case 'all':
      return condition.conditions.every((entry) => conditionMet(entry, ctx))
    default:
      return false
  }
}

function shouldRevealStep(
  step: (typeof ACT1_QUEST_STEPS)[number],
  completed: Set<string>,
): boolean {
  if (!step.revealAfterStepId) {
    return true
  }

  return completed.has(step.revealAfterStepId)
}

function scenePrerequisitesMet(
  step: (typeof ACT1_QUEST_STEPS)[number],
  ctx: ActQuestEvaluationContext,
): boolean {
  if (!step.scenePrerequisites?.length) {
    return true
  }

  return step.scenePrerequisites.every((entry) => conditionMet(entry, ctx))
}

export function evaluateAct1ProgressWithEvents(
  hub: HubState,
  character: Character,
  visitedSceneIds: Iterable<string> = [],
): Act1EvaluationResult {
  const events: Act1QuestEvent[] = []
  const origin = character.origin

  if (!origin) {
    return { hub, character, events }
  }

  const steps = stepsForOrigin(origin)
  if (steps.length === 0) {
    return { hub, character, events }
  }

  const visited = new Set(visitedSceneIds)
  let nextHub = hub
  let nextCharacter = character

  const ctx: ActQuestEvaluationContext = {
    hub: nextHub,
    characterFlags: nextCharacter.flags ?? [],
    visitedSceneIds: visited,
  }

  const act1: Act1Progress = {
    ...createInitialAct1Progress(),
    ...nextHub.act1,
  }

  const prevCompleted = new Set(act1.completedStepIds)
  const prevRevealed = new Set(act1.revealedStepIds)
  const completed = new Set(act1.completedStepIds)
  const revealed = new Set(act1.revealedStepIds)

  for (const step of steps) {
    if (shouldRevealStep(step, completed) && !revealed.has(step.id)) {
      revealed.add(step.id)
      if (!prevRevealed.has(step.id)) {
        events.push({ kind: 'step_revealed', stepId: step.id })
      }
    }

    if (conditionMet(step.completeWhen, ctx) && !completed.has(step.id)) {
      completed.add(step.id)
      events.push({ kind: 'step_completed', stepId: step.id })

      const rewarded = applyActQuestReward(nextHub, nextCharacter, step.reward)
      nextHub = rewarded.hub
      nextCharacter = rewarded.character
      ctx.hub = nextHub
      ctx.characterFlags = nextCharacter.flags ?? []
    }
  }

  const finaleScene =
    ACT1_FINALE_SCENES[origin as keyof typeof ACT1_FINALE_SCENES]
  const finaleSeen =
    act1.finaleSeen ||
    (finaleScene ? visited.has(finaleScene) : false)

  const mainIds = steps.filter((s) => s.type === 'main').map((s) => s.id)
  const allMainDone = mainIds.every((id) => completed.has(id))
  const actComplete = allMainDone && finaleSeen

  if (actComplete && !act1.actComplete) {
    events.push({ kind: 'act_complete' })
  }

  const journalEntries = [...(nextHub.journalEntries ?? [])]
  const journalId = `act1_${origin}`
  if (actComplete && !journalEntries.includes(journalId)) {
    journalEntries.push(journalId)
  }

  return {
    hub: {
      ...nextHub,
      journalEntries,
      act1: {
        completedStepIds: [...completed],
        revealedStepIds: [...revealed],
        finaleSeen,
        actComplete,
      },
    },
    character: nextCharacter,
    events,
  }
}

export function evaluateAct1Progress(
  hub: HubState,
  character: Character,
  visitedSceneIds: Iterable<string> = [],
): HubState {
  return evaluateAct1ProgressWithEvents(hub, character, visitedSceneIds).hub
}

export function getAct1StepViews(
  hub: HubState,
  character: Character,
): ActQuestStepView[] {
  const origin = character.origin
  if (!origin) {
    return []
  }

  const act1 = hub.act1 ?? createInitialAct1Progress()
  const completed = new Set(act1.completedStepIds)
  const revealed = new Set(act1.revealedStepIds)

  return stepsForOrigin(origin).map((step) => ({
    ...step,
    revealed: revealed.has(step.id),
    completed: completed.has(step.id),
  }))
}

export function getPendingAct1Scene(
  hub: HubState | undefined,
  character: Character,
  visitedSceneIds: Set<string>,
): string | null {
  if (!hub || !character.origin) {
    return null
  }

  const visited = visitedSceneIds
  const ctx: ActQuestEvaluationContext = {
    hub,
    characterFlags: character.flags ?? [],
    visitedSceneIds: visited,
  }

  const views = getAct1StepViews(hub, character)
  const ordered = [...views].sort((a, b) => a.order - b.order)

  for (const step of ordered) {
    if (step.completed || !step.revealed || !step.boostSceneId) {
      continue
    }

    if (visited.has(step.boostSceneId)) {
      continue
    }

    if (!scenePrerequisitesMet(step, ctx)) {
      continue
    }

    return step.boostSceneId
  }

  return null
}

export function boostPoolForActQuest(
  pool: string[],
  hub: HubState | undefined,
  character: Character,
  visitedSceneIds: Set<string>,
): string[] {
  if (!hub || !character.origin) {
    return []
  }

  const ctx: ActQuestEvaluationContext = {
    hub,
    characterFlags: character.flags ?? [],
    visitedSceneIds,
  }

  const views = getAct1StepViews(hub, character)
  const boosted: string[] = []

  for (const step of views) {
    if (step.completed || !step.revealed || !step.boostSceneId) {
      continue
    }

    if (!scenePrerequisitesMet(step, ctx)) {
      continue
    }

    const sceneId = step.boostSceneId
    if (
      pool.includes(sceneId) &&
      !visitedSceneIds.has(sceneId) &&
      !boosted.includes(sceneId)
    ) {
      boosted.push(sceneId)
    }
  }

  const hasActProgress = (hub.act1?.completedStepIds?.length ?? 0) > 0
  if (
    hasActProgress &&
    pool.includes('encounter_chamber_keeper') &&
    !visitedSceneIds.has('encounter_chamber_keeper') &&
    !boosted.includes('encounter_chamber_keeper')
  ) {
    boosted.push('encounter_chamber_keeper')
  }

  return boosted
}

export function markAct1FinaleSeen(hub: HubState): HubState {
  if (!hub.act1) {
    return {
      ...hub,
      act1: { ...createInitialAct1Progress(), finaleSeen: true },
    }
  }

  return {
    ...hub,
    act1: { ...hub.act1, finaleSeen: true },
  }
}
