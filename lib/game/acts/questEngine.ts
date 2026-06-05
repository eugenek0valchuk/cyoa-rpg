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

function conditionMet(
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

export function evaluateAct1ProgressWithEvents(
  hub: HubState,
  character: Character,
  visitedSceneIds: Iterable<string> = [],
): Act1EvaluationResult {
  const events: Act1QuestEvent[] = []
  const origin = character.origin

  if (!origin) {
    return { hub, events }
  }

  const steps = stepsForOrigin(origin)
  if (steps.length === 0) {
    return { hub, events }
  }

  const visited = new Set(visitedSceneIds)
  const ctx: ActQuestEvaluationContext = {
    hub,
    characterFlags: character.flags ?? [],
    visitedSceneIds: visited,
  }

  const act1: Act1Progress = {
    ...createInitialAct1Progress(),
    ...hub.act1,
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

  const journalEntries = [...(hub.journalEntries ?? [])]
  const journalId = `act1_${origin}`
  if (actComplete && !journalEntries.includes(journalId)) {
    journalEntries.push(journalId)
  }

  return {
    hub: {
      ...hub,
      journalEntries,
      act1: {
        completedStepIds: [...completed],
        revealedStepIds: [...revealed],
        finaleSeen,
        actComplete,
      },
    },
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

export function boostPoolForActQuest(
  pool: string[],
  hub: HubState | undefined,
  character: Character,
  visitedSceneIds: Set<string>,
): string[] {
  if (!hub || !character.origin) {
    return []
  }

  const views = getAct1StepViews(hub, character)
  const boosted: string[] = []

  for (const step of views) {
    if (step.completed || !step.revealed || !step.boostSceneId) {
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
