import type { Choice } from '@/lib/types/game'

export interface KeyChoiceMeta {
  /** Stable id for tests and analytics */
  id: string
  /** One-line consequence shown in the confirm overlay */
  consequence: string
}

/** sceneId:choiceId → pivot metadata */
const KEY_CHOICE_REGISTRY: Record<string, KeyChoiceMeta> = {
  'start:mouth': {
    id: 'fork_mouth',
    consequence:
      'Уста — прямой спуск в погребённый квартал. Путь короче, но рассудок сожмётся сразу.',
  },
  'start:monastery': {
    id: 'fork_monastery',
    consequence:
      'Монастырь — длиннее, но откроет колокол и катакомбы. Скверна начнёт копиться раньше.',
  },
  'monastery:bell': {
    id: 'bell_touch',
    consequence:
      'Колокол не звонит — он заставит шептать мёртвых. Метка «услышал колокол» останется в хронике.',
  },
  'bell:catacombs': {
    id: 'catacombs_descent',
    consequence:
      'Спираль вниз — точка невозврата к Первому Хору. Глубина и скверна вырастут заметно.',
  },
  'catacombs:light_candle': {
    id: 'candle_rite',
    consequence:
      'Свеча от дыхания ямы — реликвия и передышка, но яма запомнит твой жест.',
  },
  'catacombs:jump_pit': {
    id: 'pit_commit',
    consequence:
      'Прыжок в дышащую яму — самый жёсткий короткий путь вглубь. Рассудок и скверна ударят сразу.',
  },
  'pit_lip:submerged_crypt': {
    id: 'water_enter',
    consequence:
      'Вода сомкнёт горло — ты уйдёшь в затопленный склеп. Вернуться к свече будет труднее.',
  },
  'merchant:take_mask': {
    id: 'mask_claim',
    consequence:
      'Маска останется в инвентаре и изменит, какие пути откроются дальше. Синод это запомнит.',
  },
}

function registryKey(sceneId: string, choice: Choice): string {
  return `${sceneId}:${choice.id}`
}

export function getKeyChoiceMeta(
  sceneId: string,
  choice: Choice,
): KeyChoiceMeta | null {
  return KEY_CHOICE_REGISTRY[registryKey(sceneId, choice)] ?? null
}

export function isKeyChoice(sceneId: string, choice: Choice): boolean {
  return getKeyChoiceMeta(sceneId, choice) != null
}
