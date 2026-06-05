import type { Scene } from '@/lib/types/game'

export const act1HollowScenes: Record<string, Scene> = {
  act1_hollow_empty_chapel: {
    id: 'act1_hollow_empty_chapel',
    title: 'Часовня Без Имени',
    description: `
Монастырь встречает тебя **тишиной без эха**.

Иконы лиц нет — только овалы, где краска облупилась ровно. Ты подходишь ближе и понимаешь: пустота здесь не проклятие. Это **форма**, которую камера наконец признала.

Свеча на алтаре горит ровно. Не для молитвы. Для согрева пустого места, где должно быть имя.
    `.trim(),
    options: [
      {
        id: 'monastery',
        text: 'Остаться в часовне ещё на вдох',
        effects: { sanity: 3 },
      },
      {
        id: 'mouth',
        text: 'Уйти вниз — пустота не держит',
        effects: { corruption: 2, sanity: -2 },
      },
    ],
  },

  act1_hollow_merchant_debt: {
    id: 'act1_hollow_merchant_debt',
    title: 'Счёт Пустого',
    description: `
Бездыханный смотрит **сквозь** тебя — не в метафоре.

«У пустых тоже есть долг. Минус одно имя — плюс одна маска.» Он протягивает восковую форму без черт. «Не наденешь — понесёшь. Синод любит, когда пустота хоть чем-то звенит.»

Телега скрипит, будто смеётся тихо.
    `.trim(),
    options: [
      {
        id: 'merchant',
        text: 'Взять маску на пояс',
        effects: {
          sanity: -2,
          addFlags: ['claimed_mask', 'met_breathless'],
        },
      },
      {
        id: 'mouth',
        text: 'Отказаться — пустота не торгуется',
        effects: { sanity: -1, addFlag: 'met_breathless' },
      },
    ],
  },

  act1_hollow_mask_rite: {
    id: 'act1_hollow_mask_rite',
    title: 'Обряд Без Лица',
    description: `
Маска тяжелее, чем должна быть у пустой керамики.

Ты поднимаешь её к свету бледного фонаря — внутри нет отражения. Только **согласие**: тело и отсутствие наконец совпали. Голод под доспехами стихает, как будто кто-то закрыл пустую дверь.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Спуститься с маской на поясе',
        effects: { corruption: 3, sanity: -2, addFlag: 'claimed_mask' },
      },
      {
        id: 'monastery',
        text: 'Оставить маску у алтаря',
        effects: { sanity: 2 },
      },
    ],
  },

  act1_hollow_collapse_lesson: {
    id: 'act1_hollow_collapse_lesson',
    title: 'Урок Обвала',
    description: `
Камера помнит, как ты **падал**.

Не как смерть — как урок: пустота не спасает от гравитации долга. Стены спуска оставили на тебе пятно, которое в камере ещё пахнет. Ты вернулся — значит, обвал не последний.

Машина шепчет без осуждения: «Ещё раз. На этот раз — смотри, где нет опоры.»
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Спуститься снова — с пятном как картой',
        effects: { sanity: -4, corruption: 2 },
      },
      {
        id: 'mouth',
        text: 'Идти к Устам осторожнее',
        effects: { sanity: -2 },
      },
    ],
  },

  act1_hollow_finale: {
    id: 'act1_hollow_finale',
    title: 'Имя, Которого Нет',
    description: `
У Рта спрашивают имя.

Ты открываешь рот — и понимаешь, что **нечего** отдать. Не страх. Не ложь. Просто пустота, которая наконец стала честной. Машина молчит дольше обычного, будто пересчитывает форму.

Потом — тихо: «Записано: отсутствие. Акт I — принят.»
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Кивнуть пустоте и идти дальше',
        effects: { sanity: -6, corruption: 3, addFlag: 'hollow_act1_named' },
      },
      {
        id: 'monastery',
        text: 'Вернуться к часовне без имени',
        effects: { sanity: -3, addFlag: 'hollow_act1_named' },
      },
    ],
  },
}
