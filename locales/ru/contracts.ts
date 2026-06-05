export type ContractConditionKind =
  | 'extract'
  | 'flag'
  | 'min_depth'
  | 'min_sanity_end'
  | 'extract_scene'

export type ContractRewardKind = 'echo' | 'cleanse_mark' | 'next_encounter_boost'

export type ContractDef = {
  id: string
  title: string
  vow: string
  reward: string
  conditions: { kind: ContractConditionKind; value?: string | number }[]
  rewards: { kind: ContractRewardKind; value?: string | number }[]
  /** Когда предлагать — хотя бы одно совпадение */
  offerWhen?: {
    journal?: string[]
    marks?: string[]
    minExtractions?: number
    maxTotalRaids?: number
    missingJournal?: string[]
    hasMark?: string
  }
  priority?: number
}

export const scribeUi = {
  name: 'Писец Эха',
  npcName: 'Писец Эха',
  npcTitle: 'Трещина в камере',
  title: 'Обет у Порога',
  subtitle: 'Машина предлагает сделку — выполнишь, и камера запомнит',
  contractsTitle: 'Обеты',
  close: 'Закрыть',
  lockedTitle: 'Трещина молчит',
  lockedBody:
    'Писец появится после первого извлечения — когда камера поймёт, что ты умеешь возвращаться.',
  greeting:
    'Я пишу то, что ты **ещё не сказал** вслух. Выбери обет — или спускайся без долга. Без обета проще. С обетом — дороже.',
  greetingStain:
    'Пятно на стене пахнет прошлым провалом. Могу вывести обет **очищения** — если снова извлечёшься живым.',
  greetingSynod:
    'Синод слушает через Бездыханного. Принеси **метку** — и я запишу это как твою сделку, не их.',
  noContract: 'Спуститься без обета',
  activeContract: 'Принятый обет',
  pickContract: 'Выбрать обет',
  thresholdHint: 'Обет действует в этом спуске',
  fulfilled: 'Обет выполнен',
  broken: 'Обет нарушен',
  skipped: 'Без обета',
  claimEyebrow: 'Обет закрыт',
  claimGreeting:
    'Ты вернулся — и строка в моей книге **сошлась**. Забери, что обещала камера.',
  claimButton: 'Забрать награду',
  claiming: 'Писец стирает чернила…',
  claimDone: 'Награда записана в камеру.',
} as const

export const contractCatalog: ContractDef[] = [
  {
    id: 'vow_cleanse_stain',
    title: 'Очистить пятно',
    vow: 'Извлечься с глубины не меньше 3',
    reward: 'Снять «Пятно от провала» с камеры',
    conditions: [
      { kind: 'extract' },
      { kind: 'min_depth', value: 3 },
    ],
    rewards: [{ kind: 'cleanse_mark', value: 'failure_stain' }],
    offerWhen: { hasMark: 'failure_stain' },
    priority: 100,
  },
  {
    id: 'vow_synod_mark',
    title: 'Метка Синода',
    vow: 'Извлечься с меткой synod_mark на коже',
    reward: '+3 эхо',
    conditions: [
      { kind: 'extract' },
      { kind: 'flag', value: 'synod_mark' },
    ],
    rewards: [{ kind: 'echo', value: 3 }],
    offerWhen: {
      journal: ['npc_breathless'],
      missingJournal: ['npc_synod'],
    },
    priority: 90,
  },
  {
    id: 'vow_mouth_return',
    title: 'Уста как выход',
    vow: 'Извлечься у Уст (с печатью или на поверхности)',
    reward: '+2 эхо; следующий спуск — паломник чаще на пути',
    conditions: [
      { kind: 'extract' },
      { kind: 'extract_scene', value: 'mouth' },
    ],
    rewards: [
      { kind: 'echo', value: 2 },
      { kind: 'next_encounter_boost', value: 'encounter_wax_pilgrim' },
    ],
    offerWhen: { journal: ['place_mouth'] },
    priority: 80,
  },
  {
    id: 'vow_choir_split',
    title: 'Расколоть хор',
    vow: 'Извлечься с меткой choir_split',
    reward: '+3 эхо',
    conditions: [
      { kind: 'extract' },
      { kind: 'flag', value: 'choir_split' },
    ],
    rewards: [{ kind: 'echo', value: 3 }],
    offerWhen: { journal: ['place_fracture'], missingJournal: ['npc_choir'] },
    priority: 75,
  },
  {
    id: 'vow_steady_mind',
    title: 'Ясный разум',
    vow: 'Извлечься с рассудком 35 или выше',
    reward: '+2 эхо',
    conditions: [
      { kind: 'extract' },
      { kind: 'min_sanity_end', value: 35 },
    ],
    rewards: [{ kind: 'echo', value: 2 }],
    offerWhen: { minExtractions: 1 },
    priority: 50,
  },
  {
    id: 'vow_deep_step',
    title: 'Глубокий шаг',
    vow: 'Дойти до глубины 5 и извлечься',
    reward: '+4 эхо',
    conditions: [
      { kind: 'extract' },
      { kind: 'min_depth', value: 5 },
    ],
    rewards: [{ kind: 'echo', value: 4 }],
    offerWhen: { minExtractions: 1 },
    priority: 40,
  },
  {
    id: 'vow_surface_breath',
    title: 'Вернуться дышать',
    vow: 'Просто извлечься живым',
    reward: '+1 эхо',
    conditions: [{ kind: 'extract' }],
    rewards: [{ kind: 'echo', value: 1 }],
    offerWhen: { minExtractions: 0 },
    priority: 10,
  },
  {
    id: 'vow_first_threshold',
    title: 'Первый порог',
    vow: 'Дойти до глубины 2 и извлечься',
    reward: '+2 эхо',
    conditions: [
      { kind: 'extract' },
      { kind: 'min_depth', value: 2 },
    ],
    rewards: [{ kind: 'echo', value: 2 }],
    offerWhen: { maxTotalRaids: 3 },
    priority: 110,
  },
]

export const contractById = Object.fromEntries(
  contractCatalog.map((entry) => [entry.id, entry]),
) as Record<string, ContractDef>
