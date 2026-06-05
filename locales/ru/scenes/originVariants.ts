import type { Choice, Origin } from '@/lib/types/game'

export type OriginSceneVariant = {
  title?: string
  description?: string
  prependDescription?: string
  appendDescription?: string
  optionText?: Partial<Record<string, string>>
  removeOptionIds?: string[]
  addOptions?: Choice[]
}

export const originSceneVariants: Partial<
  Record<string, Partial<Record<Origin, OriginSceneVariant>>>
> = {
  start: {
    hollow: {
      prependDescription: `
Под доспехами — не тело, а **голод**. Маска на поясе тянет к земле, будто помнит, куда ты уже ходил без лица.
      `.trim(),
      optionText: {
        mouth: 'Спуститься — там, где голод затихает',
        monastery: 'В монастырь — там тишина, как дом',
      },
      addOptions: [
        {
          id: 'beat_hollow_mask',
          text: 'Поднять маску и посмотреть, что осталось под ней',
          requirements: {
            requiredOrigin: 'hollow',
            requiredArtifact: 'ashen_faceless_mask',
          },
          effects: { sanity: -3 },
        },
      ],
    },
    witness: {
      prependDescription: `
Коленопреклонённые у трещин — не незнакомцы. Ты **видел** их лица до воска. Осколок колокола на груди тихо нагревается, будто снова слышит тот последний удар.
      `.trim(),
      optionText: {
        mouth: 'Спуститься — наверстать упущенное шествие',
        monastery: 'В монастырь — там колокола ещё не замолкли',
      },
      addOptions: [
        {
          id: 'beat_witness_bell',
          text: 'Прижать осколок колокола и вспомнить ту ночь',
          requirements: { requiredOrigin: 'witness' },
          effects: { sanity: -5 },
        },
      ],
    },
    heretic: {
      prependDescription: `
Под дорогой что-то **шепчет** — не колокол, не хор. Голос из собора, который ты уже слышал под камнем. Перевёрнутый чёток обжигает ладонь сквозь ткань.
      `.trim(),
      optionText: {
        mouth: 'Спуститься к Устам — голос зовёт туда',
        monastery: 'В монастырь — проверить, услышат ли тебя святые',
        merchant: 'Спросить у Бездыханного, что Синод знает о тебе',
      },
      addOptions: [
        {
          id: 'beat_heretic_whisper',
          text: 'Ответить шёпоту в трещине под дорогой',
          requirements: { requiredOrigin: 'heretic' },
          effects: { corruption: 3, sanity: -4 },
        },
      ],
    },
  },

  merchant: {
    hollow: {
      description: `
Бездыханный стоит у телеги — так зовут купца, потому что он дышит только тогда, когда на него не смотрят.

С его фигуры свисает гниющая ткань. Среди костей и свечей он смотрит не на тебя — на **маску** на твоём поясе.

«Снова пришёл, Пустой, — шепчет он. — Она помнит твоё лицо лучше, чем ты сам. Я продаю то, что сняли с тех, кто ещё не понял, что мёртв. Тебе — не нужно.»
      `.trim(),
      addOptions: [
        {
          id: 'mouth',
          text: 'Спросить, куда делся тот, чьё лицо под маской',
          requirements: {
            requiredOrigin: 'hollow',
            requiredArtifact: 'ashen_faceless_mask',
          },
          effects: { sanity: -6, addFlag: 'met_breathless' },
        },
        {
          id: 'monastery',
          text: 'Снять маску на миг — пусть смотрит',
          requirements: {
            requiredOrigin: 'hollow',
            requiredArtifact: 'ashen_faceless_mask',
          },
          effects: { sanity: -8, corruption: 4, addFlag: 'mask_seen' },
        },
      ],
    },
    witness: {
      appendDescription: `
Осколок колокола на груди вспыхивает теплом.

«Ты был там, у дороги, — говорит Бездыханный без приветствия. — Когда они ушли вниз. Тебе не следовало **видеть** и оставаться живым. Что ты принёс им на этот раз?»
      `.trim(),
      optionText: {
        mouth: 'Сказать, что помнишь последнее шествие',
        leave_cart: 'Уйти — он и так знает слишком много',
      },
      addOptions: [
        {
          id: 'mouth',
          text: 'Рассказать, что видел у Уст в ту ночь',
          requirements: { requiredOrigin: 'witness' },
          effects: { sanity: -5, addFlag: 'met_breathless' },
        },
      ],
    },
    heretic: {
      appendDescription: `
Перевёрнутый чёток жжёт ладонь. Бездыханный кивает, будто ждал.

«Еретик. Синод уже поставил на тебя ставку. Не продавай им ответы дёшево — они перепродадут их Устам дороже.»
      `.trim(),
      optionText: {
        encounter_synod_acolyte: 'Спросить у Синода, что ждёт еретика',
        take_mask: 'Взять маску — пусть монастырь не узнает',
      },
      addOptions: [
        {
          id: 'monastery',
          text: 'Показать чёток и спросить про голос под собором',
          requirements: { requiredOrigin: 'heretic' },
          effects: { corruption: 4, sanity: -4, addFlag: 'met_breathless' },
        },
      ],
    },
  },

  take_mask: {
    hollow: {
      description: `
Маска ледяная — **знакомая**, как собственная кожа после долгой болезни.

Когда пальцы сжимаются вокруг неё, ты понимаешь: это не кража. Это **возврат**.

Колокола под землёй звонят один раз — для тебя.
      `.trim(),
    },
    witness: {
      appendDescription: `
Осколок на груди отзывается звоном. Маска и колокол — разные памяти. Ты не знаешь, какую из них унесёшь вниз.
      `.trim(),
    },
    heretic: {
      appendDescription: `
Чёток обжигает сильнее. Маска — ересь монастыря; ты берёшь её не ради лица, а ради **доступа**.
      `.trim(),
    },
  },

  mouth: {
    hollow: {
      appendDescription: `
Голод под доспехами затихает — и сразу становится страшнее. Без голода ты не знаешь, зачем идёшь.
      `.trim(),
      optionText: {
        descent: 'Спуститься — там пустота, как дом',
      },
    },
    witness: {
      appendDescription: `
Слепые фигуры на коленях поворачивают головы — не к тебе, **мимо**. Они помнят, что ты уже стоял здесь и не ушёл с ними.
      `.trim(),
    },
    heretic: {
      appendDescription: `
Голос под камнем доволен: «Наконец.» Уста не молятся — они **открываются**.
      `.trim(),
    },
  },

  monastery: {
    hollow: {
      appendDescription: `
Монастырь узнаёт пустоту в тебе. Колокол над алтарём не звенит — он **ждёт**, пока ты станешь достаточно полым, чтобы звучать.
      `.trim(),
      optionText: {
        bell: 'Идти к колоколам — там тишина отзывается',
      },
    },
    witness: {
      appendDescription: `
Трупы на коленях — те же позы, что у дороги в ту ночь. Ты видел это **до** пепла.
      `.trim(),
    },
    heretic: {
      appendDescription: `
Священный огонь на алтаре меркнет, когда ты входишь. Монастырь **помнит** твой разговор под собором.
      `.trim(),
      optionText: {
        bell: 'Искать колокол — голос под камнем говорил о нём',
      },
    },
  },

  blood_path: {
    hollow: {
      prependDescription: `
Кровь на стенах пишет не писание — **имя**, которое ты забыл. Буквы собираются в форму маски.
      `.trim(),
    },
    witness: {
      prependDescription: `
Кровь пишет дату последнего шествия. Ты узнаёшь почерк — свой, из сна, который не был сном.
      `.trim(),
    },
    heretic: {
      prependDescription: `
Кровь пишет **ответ** на вопрос, который ты задавал под собором. Строки двигаются, пока ты читаешь.
      `.trim(),
      optionText: {
        jump_pit: 'Прошептать строку в яму — проверить голос',
      },
    },
  },

  encounter_wax_pilgrim: {
    hollow: {
      appendDescription: `
Паломник замирает, глядя на твоё лицо — или на место, где оно должно быть. «Пустой, — говорит он. — Ты уже в маске. Зачем ещё один шаг?»
      `.trim(),
      optionText: {
        mouth: 'Отказаться от маски и идти к Устам',
      },
    },
    witness: {
      appendDescription: `
«Ты **не** был в хвосте, — шепчет паломник. — Но смотрел. Это хуже. Хвост забирает тело — взгляд забирает **право** на отказ.»
      `.trim(),
    },
    heretic: {
      appendDescription: `
«Синод послал тебя — или Уста? — паломник усмехается воском. — Не важно. Шаг один и тот же.»
      `.trim(),
      optionText: {
        descent: 'Спросить, что ждёт еретика внизу',
      },
    },
  },

  encounter_bell_wretch: {
    hollow: {
      appendDescription: `
Звон бьёт в **пустоту** внутри груди — отзывается больнее, чем в уши. Монастырь слышит, насколько ты полон дыр.
      `.trim(),
    },
    witness: {
      appendDescription: `
Звон совпадает с осколком на груди — одна частота, два источника. Ты снова **там**, у последнего удара.
      `.trim(),
    },
    heretic: {
      appendDescription: `
Медь на его рёбрах пульсирует в такт чётку. Голос под собором и колокол монастыря — **одна система**.
      `.trim(),
    },
  },

  encounter_choir_remnant: {
    witness: {
      appendDescription: `
Третий голос — тот, что ты слышал, стоя у дороги, когда хоры уже спустились. Он говорит: «Ты **записан** в обоих.»
      `.trim(),
    },
    hollow: {
      appendDescription: `
Гимн ищет полость — в тебе её достаточно. Голос скользит внутрь без сопротивления.
      `.trim(),
    },
    heretic: {
      appendDescription: `
«Еретики поют **мимо** хора, — шепчет осколок. — Это единственный способ не попасть в партитуру.»
      `.trim(),
    },
  },

  encounter_synod_acolyte: {
    witness: {
      appendDescription: `
«Свидетель, — говорит адепт. — Синод покупает **воспоминания**. Твоё последнее шествие уже оценено. Цена — не кровь.»
      `.trim(),
    },
    hollow: {
      appendDescription: `
«Пустой сосуд — лучшая подпись, — адепт касается твоего запястья. — Мы знаем, кто сидит внутри. Не ты.»
      `.trim(),
    },
    heretic: {
      appendDescription: `
«Ты уже подписан под камнем, — адепт усмехается. — Синод лишь **копирует** договор. Хочешь дополнительную строку?»
      `.trim(),
      optionText: {
        mouth: 'Принять метку — голос под землёй одобрит',
      },
    },
  },

  descent_echoes: {
    hollow: {
      appendDescription: `
Эхо впереди шагает **пустым** — без дыхания. Это удобно. Это тревожно.
      `.trim(),
    },
    witness: {
      appendDescription: `
Эхо несёт обрывок колокола — тот самый, после которого ты не пошёл.
      `.trim(),
    },
    heretic: {
      appendDescription: `
На камне добавлена строка, которой не было: твой вопрос под собором, процарапанный чужой рукой.
      `.trim(),
    },
  },
}
