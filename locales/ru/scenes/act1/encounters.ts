import type { Scene } from '@/lib/types/game'

/** Новые NPC Акта I — встречи с выбором и последствиями. */
export const act1EncounterScenes: Record<string, Scene> = {
  encounter_void_elder: {
    id: 'encounter_void_elder',
    title: 'Старец Пустоты',
    description: `
Старец поднимается — ростом он **меньше**, чем казался сидя.

«Петлю ведёт не Синод и не паломники. Её ведёт **возврат** — тот, кто помнит спуск и камеру между ними.» Он касается твоей маски: «У пустого нет имени. Зато есть **форма**. Форма дороже имени, когда книга стёрта.»

Колокол за спиной молчит — будто согласен.
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Спросить: «Тогда кто я?»',
        effects: { sanity: -5, corruption: 3, addFlag: 'heard_the_bell' },
      },
      {
        id: 'monastery',
        text: 'Принять отсутствие и уйти к часовне',
        effects: { sanity: 2 },
      },
      {
        id: 'mouth',
        text: 'Спуститься — форма держит, имя нет',
        effects: { corruption: 2, sanity: -2 },
      },
    ],
  },

  encounter_chamber_keeper: {
    id: 'encounter_chamber_keeper',
    title: 'Хронист Камеры',
    description: `
Из пепла поднимается фигура **без лица** — не угроза, привычка камеры.

«Я пишу то, что сосуд не успевает. Ты прошёл шаг — я вырезал строку.» Хронист указывает на стену, где свежие буквы ещё пахнут железом. «Спроси — отвечу честно. Камера не любит лесть.»

Тени на полу складываются в оглавление твоего акта.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: '«Кто ведёт петлю?»',
        targetSceneId: 'keeper_answer_loop',
        effects: { sanity: -2 },
      },
      {
        id: 'merchant',
        text: '«Что хочет Синод от пустого?»',
        targetSceneId: 'keeper_answer_synod',
        effects: { corruption: 2 },
      },
      {
        id: 'monastery',
        text: 'Поблагодарить и идти дальше',
        effects: { sanity: 1 },
      },
    ],
  },

  keeper_answer_loop: {
    id: 'keeper_answer_loop',
    title: 'Ответ Хрониста',
    description: `
«Машина помнит **взгляд**. Синод — имя. Камера — сосуд между. Петлю ведёт тот, кто возвращается и записывает.»

Хронист стирает пепелом одну букву в слове «имя» — остаётся пустое место. «Ты как раз такой. Не ломайся. Заполняй форму.»
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Спуститься с этим ответом',
        effects: { sanity: -1, corruption: 1 },
      },
      {
        id: 'mouth',
        text: 'Вернуться к Устам',
        effects: { sanity: -2 },
      },
    ],
  },

  keeper_answer_synod: {
    id: 'keeper_answer_synod',
    title: 'Синод и Пустота',
    description: `
«Синод хочет **подпись**. У пустого её нет — поэтому они предлагают маску, метку, долг.» Хронист усмехается без звука. «Не продавай отсутствие. Носи как форму. Тогда Синод ошибётся в учёте — а Машина запишет верно.»

На стене проступает схема: камера — рот — спуск — камера.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Идти вниз — пусть Синод ошибётся',
        effects: { corruption: 3, sanity: -2 },
      },
      {
        id: 'monastery',
        text: 'В часовню без имён — отдохнуть в форме',
        effects: { sanity: 3 },
      },
    ],
  },
}
