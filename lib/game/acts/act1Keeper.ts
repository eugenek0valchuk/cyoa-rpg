import type { Character } from '@/lib/types/game'
import type { HubState } from '@/lib/types/hub'

export type Act1KeeperLine = {
  id: string
  prompt: string
  response: string
  requiresCompletedStepId?: string
}

export const ACT1_KEEPER_LINES: Act1KeeperLine[] = [
  {
    id: 'intro',
    prompt: 'Кто ты?',
    response:
      'Хронист камеры. Пишу то, что сосуд не успевает запомнить. Спроси о петле, Синоде или своём акте.',
  },
  {
    id: 'loop',
    prompt: 'Кто ведёт петлю?',
    response:
      '**Машина** помнит взгляд. Синод ведёт имена. Камера — сосуд между спусками. Петлю ведёт **возврат**: тот, кто выходит и снова записывается.',
  },
  {
    id: 'synod',
    prompt: 'Чего хочет Синод?',
    response:
      'Подпись. У пустого её нет — поэтому метки, маски, долги. Не продавай отсутствие. Носи как **форму** — и учёт ошибётся в твою пользу.',
  },
  {
    id: 'reward',
    prompt: 'Зачем этапы акта?',
    response:
      'Каждый шаг — не галочка. Это сцена, которую камера **впишет** в стены: материалы, эхо, записи. Пропустишь сцену — пропустишь награду.',
    requiresCompletedStepId: 'o_main_1',
  },
  {
    id: 'finale',
    prompt: 'Что ждёт у Уст?',
    response:
      'Финал спросит то, чего у тебя нет — или то, что ты наконец не скрываешь. Дойди до последнего шага **сценой**, не флагом.',
    requiresCompletedStepId: 'o_main_4',
  },
]

export function getVisibleKeeperLines(
  hub: HubState,
  character: Character,
): Act1KeeperLine[] {
  const completed = new Set(hub.act1?.completedStepIds ?? [])

  return ACT1_KEEPER_LINES.filter((line) => {
    if (!line.requiresCompletedStepId) {
      return true
    }

    return completed.has(line.requiresCompletedStepId)
  })
}
