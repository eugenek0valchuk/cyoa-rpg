import type { OriginSceneVariant } from './originVariants'

export type RepeatSceneConfig = {
  /** Запись дневника — «помнишь этого человека» между спусками */
  journalId: string
  variant: OriginSceneVariant
  /** Короткий вариант, если сцена уже была в этом спуске */
  sameRun?: OriginSceneVariant
}

export const repeatSceneVariants: Partial<Record<string, RepeatSceneConfig>> = {
  start: {
    journalId: 'diary_awakening',
    variant: {
      prependDescription: `
Дорога узнаёт твой шаг. Пепел ложится **тоньше** — будто камера наверху уже предупредила землю, что ты снова здесь.

На коленях у трещин те же фигуры. Одна поднимает голову на миг — не к тебе, **сквозь** тебя, туда, где ты был в прошлый раз.
      `.trim(),
      addOptions: [
        {
          id: 'beat_return_road',
          text: 'Остановиться и вспомнить, куда ушёл в прошлый раз',
          targetSceneId: 'remembered_path',
          effects: { sanity: -2 },
        },
      ],
    },
  },

  merchant: {
    journalId: 'npc_breathless',
    variant: {
      title: 'Телега Помнит Тебя',
      description: `
Бездыханный не поднимает головы — он **уже** смотрит.

«Снова ты. Камера сохранила твои слухи — я слышу их сквозь пепел. Плати не зубами: **правдой**. Что ты принёс из прошлого спуска?»

Под телегой один оберег качается в такт твоему пульсу. Свечи не гаснут, когда ты подходишь.
      `.trim(),
      optionText: {
        encounter_synod_acolyte: 'Спросить, кого Синод ищет на этот раз',
        leave_cart: 'Уйти — он и так слишком много знает',
      },
      addOptions: [
        {
          id: 'merchant_reunion_trade',
          text: 'Обменять воспоминание о прошлом спуске на слух',
          targetSceneId: 'merchant_reunion',
          effects: { sanity: -4, corruption: 2 },
        },
        {
          id: 'merchant_reunion_sigil',
          text: 'Спросить про печать — если помнишь, как её вырезали',
          targetSceneId: 'merchant_sigil_hint',
          requirements: { requiredJournal: 'rite_sigil' },
          effects: { sanity: -3 },
        },
      ],
    },
    sameRun: {
      prependDescription: `
Бездыханный не моргает. «Ты только что был здесь. Телега ещё **теплая** от твоего шага.»
      `.trim(),
    },
  },

  encounter_wax_pilgrim: {
    journalId: 'npc_wax',
    variant: {
      title: 'Паломник С Твоим Пульсом',
      description: `
Маска та же — но воск **тёмнее**, будто впитал чужие ночи.

Паломник не кладёт руку на запястье. Он уже знает ритм.

«Мы считали тебя до конца. Ты **позволил**. Теперь шаг не твой — он наш. Вернуть его стоит дороже, чем в первый раз.»

На внутренней стороне маски — царапина, похожая на твоё имя, которое ты ещё не произносил вслух.
      `.trim(),
      removeOptionIds: ['descent'],
      addOptions: [
        {
          id: 'wax_reunion_bargain',
          text: 'Предложить обратный счёт — отдать одну память',
          targetSceneId: 'encounter_wax_bargain',
          requirements: { intelligence: 6 },
          effects: { sanity: -6, corruption: 3 },
        },
        {
          id: 'descent',
          text: 'Снова позволить считать — зная, чем это кончилось',
          requirements: { agility: 6 },
          effects: { corruption: 5, sanity: -4 },
        },
        {
          id: 'mouth',
          text: 'Сорвать маску и бежать к Устам',
          requirements: { strength: 7 },
          effects: { sanity: -7, corruption: 2 },
        },
      ],
    },
  },

  encounter_bell_wretch: {
    journalId: 'npc_bell_wretch',
    variant: {
      title: 'Колокол Узнал Шаг',
      description: `
Урод поднимает голову — медь на рёбрах **зеленеет** там, где ты в прошлый раз не прикоснулся.

Звон короче, злее. Он не повторяет пульс — он **исправляет** его, будто ты с тех пор идёшь не в такт.

Монастырь не слушает через него. Он **смотрит**.
      `.trim(),
      optionText: {
        bell: 'Вернуться к колоколам — закончить, что начал',
        whispers_parlor: 'Срезать новую полоску — Синод ждёт второй долг',
      },
      addOptions: [
        {
          id: 'bell_wretch_reunion',
          text: 'Приложить ухо к меди и спросить, кого монастырь слышал вместо тебя',
          targetSceneId: 'encounter_bell_listen',
          requirements: { intelligence: 7 },
          effects: { sanity: -8, corruption: 4, addFlag: 'heard_the_bell' },
        },
      ],
    },
  },

  encounter_choir_remnant: {
    journalId: 'npc_choir',
    variant: {
      title: 'Хор Помнит Третий Голос',
      description: `
Челюсть **целая** — язык вырос обратно, тонкий, как игла.

«Ты расколол нас. Ты **записал** третий. Теперь оба хора поют твоё имя в разных тональностях — и оба уверены, что правы.»

Третий голос не ждёт. Он уже звучит **изнутри** твоей груди, тихо, как напоминание.
      `.trim(),
      addOptions: [
        {
          id: 'choir_reunion_third',
          text: 'Ответить третьему голосу — не левому и не правому',
          targetSceneId: 'encounter_choir_third_reply',
          requirements: { requiredFlag: 'choir_split' },
          effects: { sanity: -7, corruption: 5 },
        },
        {
          id: 'fracture_choir',
          text: 'Идти в Расколотый неф — там партитура полная',
          targetSceneId: 'fracture_choir',
          effects: { corruption: 3, sanity: -4 },
        },
      ],
    },
  },

  encounter_synod_acolyte: {
    journalId: 'npc_synod',
    variant: {
      title: 'Синод Сверяет Книгу',
      description: `
Адепт поднимает вуаль — не лицо, **страницу**. На ней строка с твоим шагом из прошлого спуска.

«Метка **жива**. Мы не стираем — мы **уточняем**. Ты вернулся добровольно. Это редкость. Редкость стоит скидки — или дополнительной строки.»

Серый капюшон кивает в сторону телеги: Бездыханный уже знает, о чём вы говорите.
      `.trim(),
      optionText: {
        merchant: 'Вернуться к телеге — пусть купец подтвердит сделку',
        leave_cart: 'Уйти, пока строка не стала приговором',
      },
      addOptions: [
        {
          id: 'synod_reunion_amend',
          text: 'Попросить исправить запись — стереть одну ошибку',
          targetSceneId: 'encounter_synod_amend',
          requirements: { intelligence: 7 },
          effects: { sanity: -5, corruption: 3 },
        },
        {
          id: 'mouth',
          text: 'Принять вторую метку — Устам должны знать',
          requirements: { requiredFlag: 'synod_mark' },
          effects: { sanity: -8, corruption: 6 },
        },
      ],
    },
  },

  mouth: {
    journalId: 'place_mouth',
    variant: {
      prependDescription: `
Усты **открыты** шире, чем в прошлый раз. Слепые фигуры не на коленях — они стоят, лицом к тебе, будто ждали возвращения.
      `.trim(),
      addOptions: [
        {
          id: 'mouth_reunion_descent',
          text: 'Спуститься по знакомому жару — не спрашивая, кто ждал',
          targetSceneId: 'descent',
          effects: { sanity: -4, corruption: 2 },
        },
      ],
    },
  },

  fracture_choir: {
    journalId: 'place_fracture',
    variant: {
      prependDescription: `
Гимн **узнаёт** тебя. Левый хор замолкает на полуслове — правый продолжает, будто проверяя, изменился ли твой шаг.
      `.trim(),
    },
  },

  whispers_parlor: {
    journalId: 'diary_awakening',
    variant: {
      appendDescription: `
Один из пустых стульев **занят** — там сидит версия тебя из прошлого спуска. Она не говорит. Она ждёт, пока ты выберешь иначе.
      `.trim(),
      addOptions: [
        {
          id: 'parlor_reunion_echo',
          text: 'Сесть напротив и спросить, чем закончился тот путь',
          targetSceneId: 'whispers_parlor_echo',
          effects: { sanity: -5 },
        },
      ],
    },
  },
}

/** Уникальные сцены-продолжения — только через repeat-выборы */
export const repeatFollowUpScenes: Record<string, import('@/lib/types/game').Scene> = {
  remembered_path: {
    id: 'remembered_path',
    title: 'Память Дороги',
    description: `
Пепел на секунду **расступается** — не физически, а в голове.

Ты видишь не карту, а **узел**: телегу, маску, медь, вуаль, Уста. Камера наверху записала след — дорога предлагает вернуться туда, где ты уже оставил долг.

Выбери, кого или что вспомнить сильнее всего. Или иди туда, куда ведёт пепел без имени.
    `.trim(),
    options: [
      {
        id: 'encounter_wax_pilgrim',
        text: 'Следовать за пульсом — восковая маска на горизонте',
        targetSceneId: 'encounter_wax_pilgrim',
        requirements: { requiredJournal: 'npc_wax' },
        effects: { sanity: -3 },
      },
      {
        id: 'encounter_bell_wretch',
        text: 'Следовать за звоном в зубах',
        targetSceneId: 'encounter_bell_wretch',
        requirements: { requiredJournal: 'npc_bell_wretch' },
        effects: { sanity: -4 },
      },
      {
        id: 'encounter_choir_remnant',
        text: 'Следовать за третьим голосом в груди',
        targetSceneId: 'encounter_choir_remnant',
        requirements: { requiredJournal: 'npc_choir' },
        effects: { sanity: -3, corruption: 2 },
      },
      {
        id: 'encounter_synod_acolyte',
        text: 'Следовать за серой вуалью у телеги',
        targetSceneId: 'encounter_synod_acolyte',
        requirements: { requiredJournal: 'npc_synod' },
        effects: { sanity: -2, corruption: 1 },
      },
      {
        id: 'merchant',
        text: 'Вернуться к Бездыханному — он уже ждёт',
        targetSceneId: 'merchant',
        requirements: { requiredJournal: 'npc_breathless' },
        effects: { sanity: -2 },
      },
      {
        id: 'mouth',
        text: 'Не выбирать — идти туда, где пепел тяжелее всего',
        effects: { sanity: -3 },
      },
    ],
  },

  merchant_reunion: {
    id: 'merchant_reunion',
    title: 'Слух за Память',
    description: `
Бездыханный протягивает ладонь — не для монет, для **внимания**.

Ты рассказываешь обрывок: колокол, маска, трещина. Он кивает на каждое слово, будто складывает карту.

«Хорошо. Вот что **не** рассказывай Синоду: что я дал тебе дорогу к адепту без метки. Это мой риск. Твой — принять.»

Он указывает на тропу, которой не было минуту назад.
    `.trim(),
    options: [
      {
        id: 'encounter_synod_acolyte',
        text: 'Идти по новой тропе к адепту',
        targetSceneId: 'encounter_synod_acolyte',
        effects: { corruption: 2, sanity: -3 },
      },
      {
        id: 'mouth',
        text: 'Взять слух и спуститься к Устам',
        effects: { sanity: -2, addFlag: 'met_breathless' },
      },
      {
        id: 'leave_cart',
        text: 'Отказаться — долги копятся',
        effects: { sanity: -1 },
      },
    ],
  },

  merchant_sigil_hint: {
    id: 'merchant_sigil_hint',
    title: 'Строка в Железе',
    description: `
«Печать — не подарок, — шепчет Бездыханный. — Её **вырезают**, когда земля уже знает твоё имя. В прошлый раз ты вырезал не там, где думал.»

Он чертит пальцем по воздуху — схема Уст, телеги, монастыря.

«В следующий раз ищи **третью** точку. Там, где эхо идёт навстречу, а не следом.»
    `.trim(),
    options: [
      {
        id: 'merchant',
        text: 'Поблагодарить и вернуться к телеге',
        targetSceneId: 'merchant',
        effects: {},
      },
      {
        id: 'descent_echoes',
        text: 'Идти туда, где эхо навстречу',
        targetSceneId: 'descent_echoes',
        effects: { sanity: -3 },
      },
    ],
  },

  encounter_wax_bargain: {
    id: 'encounter_wax_bargain',
    title: 'Обратный Счёт',
    description: `
Паломник замирает. Воск на маске трескается — тонкая линия от подбородка к виску.

«Одну память. Не самую больную — **самую полезную**. Ты выбираешь, что отдать. Я — что вернуть.»

На секунду ты не помнишь, как зовут купца у телеги. Потом память возвращается — дороже, чем была.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Принять обмен — шаг снова твой',
        effects: { sanity: 5, corruption: 4, addFlag: 'wax_offered' },
      },
      {
        id: 'catacombs',
        text: 'Отказаться и рвануть в боковой проход',
        effects: { sanity: -4 },
      },
    ],
  },

  encounter_bell_listen: {
    id: 'encounter_bell_listen',
    title: 'Частота Монастыря',
    description: `
Медь холодная. Внутри — не эхо, а **имя**, произнесённое монахом, которого здесь уже нет.

Звон обрывается. Урод складывается, как согнутый колокол. На миг тишина **полная** — и это страшнее любого удара.

Ты знаешь частоту. Колокол в монастыре отзовётся, когда подойдёшь.
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Идти к колоколам — теперь с частотой',
        effects: { sanity: -4, addFlag: 'heard_the_bell' },
      },
      {
        id: 'monastery',
        text: 'Отступить в неф — звон ещё не закончен',
        effects: { sanity: -6 },
      },
    ],
  },

  encounter_choir_third_reply: {
    id: 'encounter_choir_third_reply',
    title: 'Ответ Третьему',
    description: `
Ты не поёшь. Ты **слушаешь** — и третий голос отвечает из твоей груди, не из челюсти в стене.

«Записан. Не в левом. Не в правом. В **между**.»

Челюсть в трещине рассыпается пылью. Гимн впереди стихает на полтона — кто-то в Расколотом нефе только что потерял партитуру.
    `.trim(),
    options: [
      {
        id: 'fracture_choir',
        text: 'Идти в неф — пока там тишина',
        targetSceneId: 'fracture_choir',
        effects: { corruption: 2, sanity: -3 },
      },
      {
        id: 'bell',
        text: 'Следовать за стихшим гимном к колоколу',
        effects: { sanity: -5, corruption: 3 },
      },
    ],
  },

  encounter_synod_amend: {
    id: 'encounter_synod_amend',
    title: 'Поправка в Книге',
    description: `
Адепт долго водит пером по воздуху — чернила **без** чернил.

«Одна строка. Не метка — **ошибка**. Какую снимаем?»

Ты выбираешь слово, которое не должно было быть произнесено у телеги. Страница шелестит. На миг Синод **молчит** — редкость, которую стоит запомнить.
    `.trim(),
    options: [
      {
        id: 'merchant',
        text: 'Вернуться к телеге — пока договор свеж',
        targetSceneId: 'merchant',
        effects: { sanity: 3 },
      },
      {
        id: 'mouth',
        text: 'Уйти к Устам — пока книга закрыта',
        effects: { sanity: -2, corruption: 1 },
      },
    ],
  },

  whispers_parlor_echo: {
    id: 'whispers_parlor_echo',
    title: 'Стул Напротив',
    description: `
Версия тебя из прошлого спуска наконец говорит — одним словом: **«Почти».**

Стулья сдвигаются. Круг разрывается. В проёме — коридор, которого не было на карте камеры.

«Ты не дошёл. Я — тоже. Но мы знаем, где **остановились**.»
    `.trim(),
    options: [
      {
        id: 'catacombs',
        text: 'Войти в проём — продолжить с того места',
        effects: { sanity: -4, corruption: 2 },
      },
      {
        id: 'exit_monastery',
        text: 'Отказаться — не каждый «почти» нужно догонять',
        effects: { sanity: 2 },
      },
    ],
  },
}
