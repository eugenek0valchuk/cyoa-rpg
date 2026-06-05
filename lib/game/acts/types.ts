import type { Character, Origin } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

export type QuestStepType = 'main' | 'optional'

export type HubMaterialRewardId =
  | 'iron_shard'
  | 'wax_seal'
  | 'choir_splinter'
  | 'folio_page'

export type ActQuestReward = {
  echo?: number
  materials?: Partial<Record<HubMaterialRewardId, number>>
  journalEntries?: string[]
  flags?: string[]
}

export type QuestCondition =
  | { kind: 'extractions'; min: number }
  | { kind: 'flag'; flag: string }
  | { kind: 'journal'; entryId: string }
  | { kind: 'best_depth'; min: number }
  | { kind: 'scene'; sceneId: string }
  | { kind: 'finale'; sceneId: string }
  | { kind: 'all'; conditions: QuestCondition[] }

export type ActQuestStepDef = {
  id: string
  origin: Origin
  type: QuestStepType
  order: number
  titleHidden: string
  titleRevealed: string
  hint: string
  /** Коротко — что произошло и зачем это важно для лора */
  completeMessage?: string
  /** Когда шаг только открылся */
  revealMessage?: string
  completeWhen: QuestCondition
  /** Сцена с высоким приоритетом, пока шаг не выполнен */
  boostSceneId?: string
  /** Когда сцена акта может появиться в спуске */
  scenePrerequisites?: QuestCondition[]
  /** Награда при завершении шага */
  reward?: ActQuestReward
  revealAfterStepId?: string
}

export type Act1Progress = {
  completedStepIds: string[]
  revealedStepIds: string[]
  finaleSeen: boolean
  actComplete: boolean
}

export type ActQuestStepView = ActQuestStepDef & {
  revealed: boolean
  completed: boolean
}

export type ActQuestEvaluationContext = {
  hub: HubState
  characterFlags: string[]
  visitedSceneIds: Set<string>
}

export type Act1QuestEvent =
  | { kind: 'step_completed'; stepId: string }
  | { kind: 'step_revealed'; stepId: string }
  | { kind: 'act_complete' }

export type Act1EvaluationResult = {
  hub: HubState
  character: Character
  events: Act1QuestEvent[]
}
