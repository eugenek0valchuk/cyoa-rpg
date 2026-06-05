import type { GameIconProps } from '@/components/game/ui/GameIcon'

export const npcEncounterUi = {
  continue: 'Дальше',
  skipToChoices: 'К делу',
  yourMove: 'Твой ответ',
  confirmChoice: 'Подтверди выбор — окно поверх сцены.',
  resolving: 'Камера записывает…',
} as const

export type NpcEncounterIcon = GameIconProps['type']

export type NpcEncounterLines = {
  first: string[]
  reunion?: string[]
  sameRun?: string[]
}

export type NpcEncounterDef = {
  npcName: string
  npcTitle: string
  imageSrc: string
  icon: NpcEncounterIcon
  journalId?: string
  baseSceneId?: string
  lines: NpcEncounterLines | string[]
}

function lines(def: NpcEncounterLines | string[]): NpcEncounterLines {
  return Array.isArray(def) ? { first: def } : def
}

export const npcEncounterByScene: Record<string, NpcEncounterDef> = {
  merchant: {
    npcName: 'Бездыханный',
    npcTitle: 'Купец у телеги',
    imageSrc: '/encounters/npc-breathless.png',
    icon: 'merchant',
    journalId: 'npc_breathless',
    lines: {
      first: [
        'Он стоит у телеги с трупами и **не дышит**, пока на него смотрят.',
        '«Плати зубами — или слухами.»',
        '«Синод всегда помнит.»',
        'Среди костей и сшитых реликвий лежит почерневшая маска. Бездыханный ждёт, что ты скажешь.',
      ],
      reunion: [
        'Снова ты. Камера сохранила твои слухи — я слышу их сквозь пепел.',
        'Плати не зубами: **правдой**. Что ты принёс из прошлого спуска?',
        'Под телегой оберег качается в такт твоему пульсу. Свечи не гаснут, когда ты подходишь.',
      ],
      sameRun: [
        'Ты только что был здесь. Телега ещё **теплая** от твоего шага.',
        '«Плати зубами — или слухами», — повторяет он, не поднимая головы. «Синод всегда помнит.»',
      ],
    },
  },

  merchant_reunion: {
    npcName: 'Бездыханный',
    npcTitle: 'Купец у телеги',
    imageSrc: '/encounters/npc-breathless.png',
    icon: 'merchant',
    baseSceneId: 'merchant',
    lines: [
      'Протяни ладонь — не для монет. Для **внимания**.',
      'Расскажи обрывок прошлого спуска. Я сложу из него карту — и дам слух, который Синод не услышит.',
      '«Вот что **не** рассказывай Синоду: что я дал тебе дорогу без метки. Это мой риск. Твой — принять.»',
    ],
  },

  merchant_sigil_hint: {
    npcName: 'Бездыханный',
    npcTitle: 'Купец у телеги',
    imageSrc: '/encounters/npc-breathless.png',
    icon: 'merchant',
    baseSceneId: 'merchant',
    lines: [
      '«Печать — не подарок. Её **вырезают**, когда земля уже знает твоё имя.»',
      '«В прошлый раз ты резал не там, где думал.»',
      '«Ищи **третью** точку — там, где эхо идёт навстречу, а не следом.»',
    ],
  },

  encounter_wax_pilgrim: {
    npcName: 'Восковой паломник',
    npcTitle: 'Счёт на запястье',
    imageSrc: '/encounters/npc-wax-pilgrim.png',
    icon: 'hollow',
    journalId: 'npc_wax',
    lines: {
      first: [
        'Из тумана — маска, воск на щеках **тёплый**, будто только что сняли с чужого лица.',
        'Ладонь ложится на запястье. Пульс считают, как чётки.',
        '«Ещё один шаг — и ты забудешь, зачем спускался. Это не проклятие. Это **облегчение**.»',
      ],
      reunion: [
        'Маска та же — но воск **тёмнее**, будто впитал чужие ночи.',
        'Он уже знает твой ритм. Не спрашивает — **напоминает**.',
        '«Мы считали тебя до конца. Ты **позволил**. Вернуть шаг стоит дороже, чем в первый раз.»',
      ],
      sameRun: [
        'Паломник не отступает. Воск на маске ещё **тёплый** от твоего пульса.',
        '«Ты только что стоял здесь. Счёт не обнуляется.»',
      ],
    },
  },

  encounter_wax_bargain: {
    npcName: 'Восковой паломник',
    npcTitle: 'Обратный счёт',
    imageSrc: '/encounters/npc-wax-pilgrim.png',
    icon: 'hollow',
    baseSceneId: 'encounter_wax_pilgrim',
    lines: [
      'Воск на маске **трескается** — тонкая линия от подбородка к виску.',
      '«Одну память. Не самую больную — **самую полезную**. Ты выбираешь, что отдать. Я — что вернуть.»',
      'На секунду ты не помнишь купца у телеги. Потом память возвращается — дороже.',
    ],
  },

  encounter_bell_wretch: {
    npcName: 'Колокольный урод',
    npcTitle: 'Медь в нише',
    imageSrc: '/encounters/npc-bell-wretch.png',
    icon: 'heretic',
    journalId: 'npc_bell_wretch',
    lines: {
      first: [
        'В алтарной нише — фигура, **скрещённая с медью**: рёбра как языки колокола.',
        'Он не говорит. Он **звенит** — коротко, больно, прямо в зубы.',
        'Когда ты делаешь шаг, звон повторяет пульс. Монастырь слушает через него.',
      ],
      reunion: [
        'Медь на рёбрах **зеленеет** там, где ты в прошлый раз не прикоснулся.',
        'Звон короче, злее. Он не повторяет пульс — **исправляет** его.',
        'Монастырь не слушает через него. Он **смотрит**.',
      ],
      sameRun: [
        'Урод не шевелится — но медь **ещё дрожит** от твоего прошлого шага.',
        'Звон обрывается, когда ты замираешь. Будто ждёт, что ты снова движешься.',
      ],
    },
  },

  encounter_bell_listen: {
    npcName: 'Колокольный урод',
    npcTitle: 'Частота монастыря',
    imageSrc: '/encounters/npc-bell-wretch.png',
    icon: 'heretic',
    baseSceneId: 'encounter_bell_wretch',
    lines: [
      'Медь холодная. Внутри — не эхо, а **имя**, произнесённое монахом, которого здесь уже нет.',
      'Звон обрывается. Урод складывается, как согнутый колокол.',
      'На миг тишина **полная** — и это страшнее любого удара. Ты знаешь частоту.',
    ],
  },

  encounter_choir_remnant: {
    npcName: 'Осколок хора',
    npcTitle: 'Третий голос',
    imageSrc: '/encounters/npc-choir-remnant.png',
    icon: 'flag',
    journalId: 'npc_choir',
    lines: {
      first: [
        'Из трещины торчит челюсть **без языка** — и всё же поёт.',
        '«Мы ждали тебя в **левом** хоре. Нет — в **правом**. Оба ждали. Оба уже поют с твоими губами.»',
        'На миг слышен **третий** голос — тот, что не выбрал сторону.',
      ],
      reunion: [
        'Челюсть **целая** — язык вырос обратно, тонкий, как игла.',
        '«Ты расколол нас. Ты **записал** третий. Оба хора поют твоё имя — и оба уверены, что правы.»',
        'Третий голос звучит **изнутри** груди, тихо, как напоминание.',
      ],
      sameRun: [
        'Гимн обрывается на полуслове, когда ты возвращаешься.',
        '«Ты **ещё** не выбрал. Хор не терпит пауз.»',
      ],
    },
  },

  encounter_choir_third_reply: {
    npcName: 'Осколок хора',
    npcTitle: 'Ответ третьему',
    imageSrc: '/encounters/npc-choir-remnant.png',
    icon: 'flag',
    baseSceneId: 'encounter_choir_remnant',
    lines: [
      'Ты не поёшь. Ты **слушаешь** — и третий голос отвечает из груди, не из челюсти.',
      '«Записан. Не в левом. Не в правом. В **между**.»',
      'Челюсть рассыпается пылью. Гимн впереди стихает на полтона.',
    ],
  },

  encounter_synod_acolyte: {
    npcName: 'Адепт Синода',
    npcTitle: 'Под серой вуалью',
    imageSrc: '/encounters/npc-synod-acolyte.png',
    icon: 'witness',
    journalId: 'npc_synod',
    lines: {
      first: [
        'У телеги — не Бездыханный. Другой капюшон, **серый**, без пепла.',
        '«Синод ведёт учёт тех, кто **смотрит** вниз, не спускаясь. Твоё имя ещё не в книге.»',
        '«Это можно исправить — или **стереть**. Стоит записать, когда будешь готов.»',
      ],
      reunion: [
        'Адепт листает книгу, не поднимая головы. Страница **шелестит** сама.',
        '«Синод сверяет. Твоё имя уже есть — но строка ещё **мокрая**.»',
        '«Метка или поправка. Третьего не дано.»',
      ],
      sameRun: [
        'Перо зависло над строкой, которую ты ещё не сделал.',
        '«Не уходи на полуслове. Синод **дописывает** за тебя.»',
      ],
    },
  },

  encounter_synod_amend: {
    npcName: 'Адепт Синода',
    npcTitle: 'Поправка в книге',
    imageSrc: '/encounters/npc-synod-acolyte.png',
    icon: 'witness',
    baseSceneId: 'encounter_synod_acolyte',
    lines: [
      'Адепт водит пером по воздуху — чернила **без** чернил.',
      '«Одна строка. Не метка — **ошибка**. Какую снимаем?»',
      'Страница шелестит. На миг Синод **молчит** — редкость, которую стоит запомнить.',
    ],
  },
}

export function getNpcEncounterDef(sceneId: string): NpcEncounterDef | null {
  return npcEncounterByScene[sceneId] ?? null
}

export function resolveNpcEncounterLines(
  sceneId: string,
  journalEntries: string[],
  visitedSceneIds: Set<string>,
): string[] {
  const def = getNpcEncounterDef(sceneId)

  if (!def) {
    return []
  }

  const parsed = lines(def.lines)

  if (Array.isArray(def.lines)) {
    return def.lines
  }

  const baseId = def.baseSceneId ?? sceneId

  if (def.journalId && journalEntries.includes(def.journalId) && parsed.reunion) {
    return parsed.reunion
  }

  if (visitedSceneIds.has(baseId) && parsed.sameRun) {
    return parsed.sameRun
  }

  return parsed.first
}
