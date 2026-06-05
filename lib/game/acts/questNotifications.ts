import { ACT1_QUEST_STEPS } from '@/lib/game/acts/act1Quests'
import { formatQuestReward } from '@/lib/game/acts/formatQuestReward'
import type { Act1QuestEvent } from '@/lib/game/acts/types'
import type { HubToastItem } from '@/components/ui/HubToast'
import { act1Ui } from '@/locales/ru/acts/act1Ui'

const stepById = Object.fromEntries(
  ACT1_QUEST_STEPS.map((step) => [step.id, step]),
)

export function act1EventsToToasts(events: Act1QuestEvent[]): HubToastItem[] {
  const toasts: HubToastItem[] = []

  for (const event of events) {
    if (event.kind === 'act_complete') {
      toasts.push({
        id: `act-complete-${Date.now()}`,
        title: act1Ui.toastActComplete,
        body: act1Ui.actComplete,
        tone: 'quest',
      })
      continue
    }

    const step = stepById[event.stepId]
    if (!step) {
      continue
    }

    if (event.kind === 'step_completed') {
      const reward = formatQuestReward(step.reward)
      const body = step.completeMessage ?? step.hint
      toasts.push({
        id: `step-done-${event.stepId}-${Date.now()}`,
        title: step.titleRevealed,
        body: reward ? `${body} ${reward}.` : body,
        tone: 'quest',
      })
    }

    if (event.kind === 'step_revealed') {
      toasts.push({
        id: `step-new-${event.stepId}-${Date.now()}`,
        title: step.titleRevealed,
        body: step.revealMessage ?? step.hint,
        tone: 'quest',
      })
    }
  }

  return toasts
}
