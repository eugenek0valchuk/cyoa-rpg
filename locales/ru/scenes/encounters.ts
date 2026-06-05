import type { Scene } from '@/lib/types/game'

export const encounterScenes: Record<string, Scene> = {
  encounter_wax_pilgrim: {
    id: 'encounter_wax_pilgrim',
    title: 'Восковой Паломник',
    description: `
Из тумана выходит фигура в маске — воск на щеках ещё тёплый, будто только что сняли с чужого лица.

Она не спрашивает имени. Она кладёт ладонь на твоё запястье и считает пульс, как монах считает чётки.

«Ещё один шаг — и ты забудешь, зачем спускался. Это не проклятие. Это облегчение.»
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Отнять руку и идти к Устам',
        effects: { sanity: -3 },
      },
      {
        id: 'descent',
        text: 'Позволить считать до конца',
        requirements: { agility: 6 },
        effects: { corruption: 3, addFlag: 'wax_offered' },
      },
      {
        id: 'catacombs',
        text: 'Вывернуть запястье и сбежать в боковой проход',
        requirements: { strength: 6 },
        effects: { sanity: -5, corruption: 2 },
      },
    ],
  },

  encounter_bell_wretch: {
    id: 'encounter_bell_wretch',
    title: 'Колокольный Урод',
    description: `
В алтарной нише сидит человек, скрещённый с медью: ребра — как языки колокола, губы припаяны к безмолвному клину.

Он не говорит. Он **звенит** — коротко, больно, прямо в зубы.

Когда ты делаешь шаг, звон повторяет твой пульс. Монастырь слушает через него.
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Подойти к колоколам и заглушить эхо',
        requirements: { strength: 7 },
        effects: { sanity: -4, corruption: 3 },
      },
      {
        id: 'monastery',
        text: 'Отступить в пустой неф',
        effects: { sanity: -2 },
      },
      {
        id: 'whispers_parlor',
        text: 'Срезать медную полоску с его ребра',
        requirements: { intelligence: 6 },
        effects: { corruption: 5, sanity: -6, addFlag: 'synod_mark' },
      },
    ],
  },

  encounter_choir_remnant: {
    id: 'encounter_choir_remnant',
    title: 'Осколок Хора',
    description: `
Из трещины в стене торчит челюсть без языка — и всё же поёт.

Голос тонкий, как трещина в стекле: «Мы ждали тебя в **левом** хоре. Нет — в **правом**. Оба ждали. Оба **уже** поют с твоими губами.»

На миг ты слышишь **третий** голос — тот, что не выбрал сторону.
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Закрыть уши и идти на звон колокола',
        effects: { sanity: -5, corruption: 4 },
      },
      {
        id: 'light_candle',
        text: 'Прошептать гимн в ответ',
        requirements: { intelligence: 7 },
        effects: { sanity: -8, corruption: 6, addFlag: 'choir_split' },
      },
      {
        id: 'fracture_stairs',
        text: 'Разбить челюсть камнем и бежать',
        requirements: { strength: 6 },
        effects: { sanity: -3, corruption: 2 },
      },
    ],
  },

  encounter_synod_acolyte: {
    id: 'encounter_synod_acolyte',
    title: 'Адепт под Вуалью',
    description: `
У телеги стоит не Бездыханный — другой капюшон, серый, без пепла.

«Синод ведёт учёт тех, кто **смотрит** вниз, не спускаясь. Твоё имя ещё не в книге. Это можно исправить — или стереть.»

«Синод ведёт учёт…» — и ты понимаешь: это стоит **записать**. Открой хронику вверху, когда будешь готов.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Принять метку и слух о Устах',
        requirements: { intelligence: 5 },
        effects: { sanity: -6, corruption: 4, addFlag: 'synod_mark' },
      },
      {
        id: 'merchant',
        text: 'Отказаться и вернуться к телеге',
        effects: { sanity: -2 },
      },
      {
        id: 'leave_cart',
        text: 'Уйти, не дав ему закончить фразу',
        requirements: { agility: 6 },
        effects: { sanity: -1 },
      },
    ],
  },
}
