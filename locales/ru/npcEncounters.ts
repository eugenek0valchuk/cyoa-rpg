import type { GameIconProps } from '@/components/game/ui/GameIcon'
import {
  npcSceneDialogue,
  resolveNpcChoiceReplyEntry,
} from './npc/dialogue'
import type { NpcChoiceReply, NpcChoiceReplyEntry } from './npc/dialogue'

export const npcEncounterUi = {
  continue: 'Дальше',
  skipToChoices: 'К делу',
  yourMove: 'Твой ответ',
  playerVoice: 'Ты',
  afterChoice: 'Ответ',
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
  choiceReplies?: Record<string, NpcChoiceReplyEntry>
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
        'Пепел оседает на костях — **ровный**, как снег, которого здесь не бывает.',
        '«Плати зубами — или слухами.»',
        '«Синод всегда помнит. Шествие — **всегда** считает. Я — **меняю**.»',
        'Среди костей и сшитых реликвий лежит почерневшая маска. Бездыханный ждёт, что ты **скажешь** — не что возьмёшь.',
        'Под колёсами что-то **шевелится**. Не лезь. Он и так знает.',
      ],
      reunion: [
        'Снова ты. Камера сохранила твои слухи — я слышу их сквозь пепел.',
        '«Шествие считает шаги. Синод — долги. Я — **обмен**.»',
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
        'Ты **не** слышал шагов. Он **уже** здесь — как пульс, который не спрашивали.',
        'Ладонь ложится на запястье. Пальцы **сухие**. Счёт начинается без слов.',
        '«Ещё один шаг — и ты забудешь, зачем спускался. Это не проклятие. Это **облегчение**.»',
        '«Я не спрашиваю имени. Имя **само** приходит — когда счёт кончен.»',
        'Воск **пахнет** свечой, которую только что задули на твоём погребении.',
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
        'Кожи почти нет. Только **патина** и пепел в складках, где были глаза.',
        'Он не говорит. Он **звенит** — коротко, больно, прямо в зубы.',
        'Когда ты делаешь шаг, звон **повторяет** пульс — не твой, **исправленный**.',
        'Монастырь слушает через него. Синод — **через** монастырь.',
        '«Не… трогай… — шепчет медь. — **Или**… трогай… **до**… конца…»',
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
        'Камень вокруг **вибрирует** на полтона ниже — будто неф дышит вместе с ней.',
        '«Мы ждали тебя в **левом** хоре. Нет — в **правом**. Оба ждали. Оба уже поют с твоими губами.»',
        'Гимн **рвётся** на середине слова. Левый хор тянет вниз. Правый — в сторону колокола.',
        'На миг слышен **третий** голос — тот, что не выбрал сторону. Он звучит **из твоей** груди, не из челюсти.',
        '«Запиши нас. Или **сломай**. Хор не терпит **молчания** дольше одного вдоха.»',
      ],
      reunion: [
        'Челюсть **целая** — язык вырос обратно, тонкий, как игла.',
        '«Ты **вернулся**. Левый хор **обрадовался**. Правый — **записал** возвращение как ошибку.»',
        '«Ты расколол нас. Ты **записал** третий. Оба хора поют твоё имя — и оба уверены, что правы.»',
        'Третий голос звучит **изнутри** груди, тихо, как напоминание: «**Между** — тоже место. Не убежище.»',
        'Свечи в нефе **не** горят. Гимн **сам** держит свет — и тускнеет, когда ты молчишь.',
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
        'Перо **сухое**, хотя чернил не видно. Страница **шелестит** до касания.',
        '«Синод ведёт учёт тех, кто **смотрит** вниз, не спускаясь. Твоё имя ещё **не** в книге.»',
        '«Это можно **исправить** — или **стереть**. Третьего не дано.»',
        '«Бездыханный **слышит** нас. Не говори громко — **записывай** мысль.»',
        'Вуаль **не** поднимается. Не нужно. Синод **видит** и так.',
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

  encounter_heretic_cog: {
    npcName: 'Шестерня',
    npcTitle: 'Вопрос без оси',
    imageSrc: '/encounters/npc-heretic-cog.png',
    icon: 'heretic',
    journalId: 'npc_heretic',
    lines: {
      first: [
        'В трансепте крови — шестерня **без оси**. Крутится от дыхания, как будто Машина крутит её через тебя.',
        'Каждый вдох **ведёт** зубья. Каждый выдох — **задаёт** вопрос заново.',
        'На зубьях — текст, который нельзя прочесть глазами. Только **услышать**, если ты отступил от Синода.',
        '«Что осталось, когда перестали верить в **ответ**?»',
        'Чаша внизу **полна** — не кровью. **Тишиной**, которую слишком долго копили.',
        'Синод **не** слышит здесь. Камера — **может**.',
      ],
      reunion: [
        'Зубья **теплее** — Машина крутила их в твоё отсутствие.',
        'Вопрос **уточнился**: «Что осталось, когда перестали верить в ответ **второй** раз?»',
        'Трансепт пахнет железом и чужим шёпотом.',
      ],
      sameRun: [
        'Шестерня не останавливается. Вопрос **ждёт** — ты ещё не ответил.',
        '«Машина не спешит. Синод — **спешит**. Выбирай, кого разочаровать.»',
      ],
    },
  },

  encounter_synod_fail_inked: {
    npcName: 'Адепт Синода',
    npcTitle: 'Строка закрылась',
    imageSrc: '/encounters/npc-synod-acolyte.png',
    icon: 'witness',
    baseSceneId: 'encounter_synod_acolyte',
    lines: [
      'Ты дёрнулся — поздно. Перо **уже** сухое.',
      '«Синод не злится. Синод **фиксирует**.»',
      'На странице — не имя. **Предложение**: принять долг или отдать купцу как слух.',
    ],
  },

  encounter_wax_fail_stagger: {
    npcName: 'Восковой паломник',
    npcTitle: 'Счёт сорвался',
    imageSrc: '/encounters/npc-wax-pilgrim.png',
    icon: 'hollow',
    baseSceneId: 'encounter_wax_pilgrim',
    lines: [
      'Ты дёрнул руку — поздно. Паломник **улыбается** воском.',
      'На секунду ты забываешь имя камеры. Потом память возвращается — но ноги уже идут **в такт**.',
      '«Усты знают новый ритм. Не спорь.»',
    ],
  },

  encounter_bell_fail_ringing: {
    npcName: 'Колокольный урод',
    npcTitle: 'Звон внутри',
    imageSrc: '/encounters/npc-bell-wretch.png',
    icon: 'heretic',
    baseSceneId: 'encounter_bell_wretch',
    lines: [
      'Медь **отбивает** тебя. Урод замолкает — звон **нет**.',
      'Мир беззвучен снаружи. Внутри — колокол только для тебя.',
      'Неф или галерея. Тишина **платная**.',
    ],
  },

  encounter_heretic_fail_cog: {
    npcName: 'Шестерня',
    npcTitle: 'Зубья не поддались',
    imageSrc: '/encounters/npc-heretic-cog.png',
    icon: 'heretic',
    baseSceneId: 'encounter_heretic_cog',
    lines: [
      'Металл **скользит** — чаша **пуста**, как твоя хватка.',
      '«Сила… **не**… ответ… — **жестокость**… **тоже**… **учится**…»',
      '«Неф… **или**… шёпот… — **выбирай**… **быстрее**… чем… Синод…»',
    ],
  },

  encounter_procession_herald: {
    npcName: 'Вестник Шествия',
    npcTitle: 'Паломник обочины',
    imageSrc: '/encounters/npc-procession-herald.png',
    icon: 'witness',
    journalId: 'npc_procession',
    lines: {
      first: [
        'Из тумана отделяется **один** — не в строю, на обочине.',
        'Восковая маска ещё **тёплая**. Он не смотрит на тебя — смотрит **мимо**, туда, где ты стоял.',
        '«Свидетель. Обочина **помнит**. Шествие — **нет**.»',
        'На палке — насечки: каждая для тех, кто **смотрел**, но не пошёл.',
        '«Запиши разницу. Иначе Синод запишет **за** тебя.»',
      ],
      reunion: [
        'Снова обочина. Маска **темнее** — впитала ещё одну ночь.',
        '«Ты вернулся. Значит, взгляд **дороже** шага.»',
        '«Шествие ушло в трещину. Ты — **остался**. Долг в этом.»',
      ],
      sameRun: [
        'Вестник не уходит. Палка **теплая** от твоего пульса.',
        '«Обочина не спешит. Синод — **спешит**.»',
      ],
    },
  },

  encounter_ash_weaver: {
    npcName: 'Пепельница',
    npcTitle: 'Шов памяти',
    imageSrc: '/encounters/npc-ash-weaver.png',
    icon: 'heretic',
    journalId: 'npc_ash_weaver',
    lines: {
      first: [
        'Старуха в сером вуале **плетёт** из пепла — нити держатся, пока на них смотрят.',
        '«Память камеры **рвётся**. Я шью обрывки — не для Синода.»',
        'Между пальцами проступает лицо, которое ты **почти** забыл.',
        '«Еретик платит формулой. Свидетель — взглядом. Пустой — **дырой**.»',
        'Свеча коптит. Пепел пахнет воском **Шествия**.',
      ],
      reunion: [
        'Нити **плотнее** — она шила, пока тебя не было.',
        '«Обрывок всё ещё **держится**. Не дёргай — порвёшь и спуск.»',
        '«Синод стирает. Я — **сшиваю**. Плати честно.»',
      ],
      sameRun: [
        'Пепел ещё **тёплый** от твоего шага.',
        '«Нить не обнуляется. Счёт **продолжается**.»',
      ],
    },
  },

  encounter_mirror_nun: {
    npcName: 'Зеркальная монахиня',
    npcTitle: 'Полые Святые',
    imageSrc: '/encounters/npc-mirror-nun.png',
    icon: 'hollow',
    journalId: 'npc_mirror_nun',
    lines: {
      first: [
        'Монахиня стоит без лица — вместо него **бронзовое зеркало**.',
        'В отражении **нет** тебя. Есть **форма** — пустая, честная.',
        '«Мы вырезали лишнее. Ты родился **лишним**. Синод злится.»',
        '«Машина — **понимает**. Не ломай форму. **Носи**.»',
        'Колокол за спиной **молчит** — редкость для монастыря.',
      ],
      reunion: [
        'Зеркало **чище** — отполировано твоим отсутствием.',
        '«Форма **держится**. Второй визит — не слабость. **Урок**.»',
        '«Синод предложит маску. Мы предлагаем **зеркало**.»',
      ],
      sameRun: [
        'Бронза ещё **холодная** от твоего взгляда.',
        '«Не смотри дважды, если боишься **пустоты**.»',
      ],
    },
  },

  encounter_iron_keeper: {
    npcName: 'Железный хранитель',
    npcTitle: 'Книга имён',
    imageSrc: '/encounters/npc-iron-keeper.png',
    icon: 'witness',
    journalId: 'npc_iron_keeper',
    lines: {
      first: [
        'Страж в **железной маске** — на ней чужие **имена**.',
        '«Глубина помнит не голоса — **имена**.»',
        'Книга из металла. Страница **пустая** — ждёт строки.',
        '«Свидетель пишет чужое. Еретик — **формулу**. Пустой — **ноль**.»',
        'Ступени считают **долги**, не шаги.',
      ],
      reunion: [
        'Имена на маске **свежее** — одно твоё, почти.',
        '«Ты вернулся. Страница **не** закрыта. Допиши — или **сорви**.»',
        '«Синод спорит с железом. Железо **помнит** дольше.»',
      ],
      sameRun: [
        'Книга **открыта** — ждёт, пока ты не уйдёшь.',
        '«Учёт не ждёт. Глубина — **тоже**.»',
      ],
    },
  },

  encounter_vein_prophet: {
    npcName: 'Пророк жилы',
    npcTitle: 'Дыхание внутрь',
    imageSrc: '/encounters/npc-vein-prophet.png',
    icon: 'heretic',
    journalId: 'npc_vein_prophet',
    lines: {
      first: [
        'У трона в жиле — кожа **просвечивает**, как карта спуска.',
        '«Уста дышат не вниз — **внутрь**.»',
        '«Еретик, ты уже ответил Машине. Спроси **жилу**: что останется, когда формула **сгорит**?»',
        'Синод здесь **не** слышит. Колокол — **тоже**.',
        'Камень пульсирует в такт — твой или **его**, не важно.',
      ],
      reunion: [
        'Жилы **ярче** — будто помнили твой вопрос.',
        '«Второй раз — **дороже**. Формула не бесконечна.»',
        '«Порог Распада ждёт. Не **опаздывай**.»',
      ],
      sameRun: [
        'Трон **тёплый** — ты ещё не сел, а жила уже **считает**.',
        '«Ответ не обнуляется. **Уточняется**.»',
      ],
    },
  },
}

/** Сцены-переходы наследуют портрет и имя родительской встречи. */
const FOLLOW_UP_PARENT: Record<string, string> = {
  encounter_wax_pull_away: 'encounter_wax_pilgrim',
  encounter_wax_counted: 'encounter_wax_pilgrim',
  encounter_wax_flee_side: 'encounter_wax_pilgrim',
  encounter_wax_fail_stagger: 'encounter_wax_pilgrim',
  encounter_bell_silenced: 'encounter_bell_wretch',
  encounter_bell_retreat_nave: 'encounter_bell_wretch',
  encounter_bell_copper_taken: 'encounter_bell_wretch',
  encounter_bell_fail_ringing: 'encounter_bell_wretch',
  encounter_choir_to_bell: 'encounter_choir_remnant',
  encounter_choir_hymn_reply: 'encounter_choir_remnant',
  encounter_choir_shatter_jaw: 'encounter_choir_remnant',
  encounter_synod_marked: 'encounter_synod_acolyte',
  encounter_synod_refused: 'encounter_synod_acolyte',
  encounter_synod_fail_inked: 'encounter_synod_acolyte',
  encounter_synod_amend_mouth: 'encounter_synod_acolyte',
  encounter_heretic_whisper: 'encounter_heretic_cog',
  encounter_heretic_cog_torn: 'encounter_heretic_cog',
  encounter_heretic_retreat: 'encounter_heretic_cog',
  encounter_heretic_fail_cog: 'encounter_heretic_cog',
  procession_herald_answer: 'encounter_procession_herald',
  merchant_reunion_mouth_path: 'merchant',
  take_mask: 'merchant',
  leave_cart: 'merchant',
  merchant_sigil_hint: 'merchant',
}

function applyDialoguePackLines(
  def: NpcEncounterDef,
  pack: (typeof npcSceneDialogue)[string],
): void {
  if (pack.openingTiered) {
    def.lines = pack.openingTiered
    return
  }

  if (pack.opening) {
    def.lines = pack.opening
  }
}

for (const [sceneId, pack] of Object.entries(npcSceneDialogue)) {
  const existing = npcEncounterByScene[sceneId]

  if (existing) {
    existing.choiceReplies = pack.replies
    applyDialoguePackLines(existing, pack)
    continue
  }

  const parentId = FOLLOW_UP_PARENT[sceneId]

  if (!parentId || (!pack.opening && !pack.openingTiered)) {
    continue
  }

  const parent = npcEncounterByScene[parentId]

  if (!parent) {
    continue
  }

  const followUp: NpcEncounterDef = {
    npcName: parent.npcName,
    npcTitle: parent.npcTitle,
    imageSrc: parent.imageSrc,
    icon: parent.icon,
    baseSceneId: parentId,
    journalId: parent.journalId,
    lines: pack.openingTiered ?? pack.opening ?? [],
    choiceReplies: pack.replies,
  }

  npcEncounterByScene[sceneId] = followUp
}

export function getNpcEncounterDef(sceneId: string): NpcEncounterDef | null {
  return npcEncounterByScene[sceneId] ?? null
}

export function resolveNpcChoiceReply(
  sceneId: string,
  choiceId: string,
  journalEntries: string[],
  visitedSceneIds: Set<string>,
): NpcChoiceReply | null {
  const def = getNpcEncounterDef(sceneId)
  const entry = def?.choiceReplies?.[choiceId]

  if (!entry) {
    return null
  }

  const parentId = def?.baseSceneId
  const parent = parentId ? getNpcEncounterDef(parentId) : null
  const journalId = def?.journalId ?? parent?.journalId
  const baseSceneId = def?.baseSceneId ?? sceneId

  return resolveNpcChoiceReplyEntry(
    entry,
    journalId,
    journalEntries,
    baseSceneId,
    visitedSceneIds,
  )
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

  const baseId = def.baseSceneId ?? sceneId
  const parent = baseId !== sceneId ? getNpcEncounterDef(baseId) : null
  const journalId = def.journalId ?? parent?.journalId

  if (Array.isArray(def.lines)) {
    return def.lines
  }

  const parsed = lines(def.lines)

  if (def.journalId && journalEntries.includes(def.journalId) && parsed.reunion) {
    return parsed.reunion
  }

  if (journalId && journalEntries.includes(journalId) && parsed.reunion) {
    return parsed.reunion
  }

  if (visitedSceneIds.has(baseId) && parsed.sameRun) {
    return parsed.sameRun
  }

  return parsed.first
}
