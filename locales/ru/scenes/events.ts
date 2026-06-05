import type { Scene } from '@/lib/types/game'

export const eventScenes: Record<string, Scene> = {
  candle_afterglow: {
    id: 'candle_afterglow',
    title: 'Огонь Договаривает',
    description: `
Свеча трещит без звука. Ниши вокруг **не** повторяют твоё лицо — впервые за долгое время.

Шёпот с ямы стихает, будто уважает паузу. Ты успеваешь понять: катакомбы — не карта улиц. Это **комната**, где можно остановиться.

Потом огонь кивает в сторону спирали на полу — мол, когда будешь готов, не беги.
    `.trim(),
    options: [
      {
        id: 'catacombs',
        text: 'Вернуться в зал — спокойнее',
        targetSceneId: 'catacombs',
        effects: { sanity: 2 },
      },
      {
        id: 'jump_pit',
        text: 'Теперь спуститься к яме — без спешки',
        targetSceneId: 'jump_pit',
        effects: { corruption: 2, sanity: -2 },
      },
      {
        id: 'read_writings',
        text: 'Прочесть надписи, пока тишина держится',
        targetSceneId: 'read_writings',
        requirements: { intelligence: 5 },
        effects: { sanity: -2 },
      },
    ],
  },

  light_candle: {
    id: 'light_candle',
    title: 'Свеча Хора',
    description: `
Ты ловишь дыхание ямы в ладонях — пламя вспыхивает без тепла.

Каждая ниша в катакомбах отзывается тусклым светом. Погребальные фигуры не шевелятся, но их губы дрожат, словно пытаясь заговорить.

Свеча в твоей руке отражает лица, не совпадающие с твоим.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Спуститься к дышащей тьме',
        effects: { corruption: 3, sanity: -4 },
      },
      {
        id: 'read_writings',
        text: 'Идти за шёпотом к настенным надписям',
        requirements: { intelligence: 5 },
        effects: { sanity: -3 },
      },
      {
        id: 'catacombs',
        text: 'Остаться среди ниш — дать свече договорить',
        targetSceneId: 'candle_afterglow',
        effects: { sanity: 1 },
      },
    ],
  },

  pit_lip: {
    id: 'pit_lip',
    title: 'На Грани Горла',
    description: `
Вода чёрная — не от тьмы, а от **плотности**. Она не плещется; она дышит.

Имя без согласных повторяется снова. Не зовёт **тебя** — проверяет, останешься ли ты слушать.

На секунду ты понимаешь: спешить вниз — не единственный способ услышать ответ. Можно остаться на губе ямы и задать вопрос вслух.
    `.trim(),
    options: [
      {
        id: 'pit_listen',
        text: 'Спросить, кто ждёт внизу — не спускаясь',
        requirements: { intelligence: 5 },
        effects: { sanity: -2, corruption: 1 },
      },
      {
        id: 'submerged_crypt',
        text: 'Войти в воду — горло сомкнётся',
        effects: { corruption: 4, sanity: -5 },
      },
      {
        id: 'light_candle',
        text: 'Вернуться к свече — огонь ещё не договорил',
        targetSceneId: 'light_candle',
        effects: { sanity: 2 },
      },
    ],
  },

  pit_listen: {
    id: 'pit_listen',
    title: 'Имя Без Согласных',
    description: `
Ты спрашиваешь. Вода замирает.

Ответ — не слово, а **температура**: теплее, чем должна быть вода в склепе. Будто кто-то снизу узнал твой шаг из прошлого спуска.

«Ещё не время», — наконец говорит тишина. Или это говоришь ты — уже не уверен.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Остаться у ямы — дождаться следующего вдоха',
        targetSceneId: 'jump_pit',
        effects: { sanity: 1 },
      },
      {
        id: 'read_writings',
        text: 'Идти к надписям — там ответ записан',
        targetSceneId: 'read_writings',
        effects: { sanity: -2 },
      },
    ],
  },

  jump_pit: {
    id: 'jump_pit',
    title: 'Дышащая Яма',
    description: `
Яма не пуста. Она — горло.

Тёплый воздух поднимается размеренными вздохами, неся вкус ржавчины и дыма от гимнов. Стены усеяны зацементированной костью — отполированной бесчисленными спусками до тебя.

Что-то внизу выдыхает твоё имя без согласных.
    `.trim(),
    options: [
      {
        id: 'pit_lip',
        text: 'Подойти к краю — вода зовёт',
        targetSceneId: 'pit_lip',
        effects: { corruption: 2, sanity: -3 },
      },
      {
        id: 'iron_passage',
        text: 'Вползти в боковую трещину',
        requirements: { agility: 6 },
        effects: { sanity: -5 },
      },
    ],
  },

  read_writings: {
    id: 'read_writings',
    title: 'Запретный Лексикон',
    description: `
Надписи не высечены. Они растут.

Каждая строка — грех, который собор забыл совершить. Прочесть вслух — молитва. Прочесть в тишине — кража.

Глаза болят от слов, что старше языка.
    `.trim(),
    options: [
      {
        id: 'catacombs_retreat',
        text: 'Перестать читать и отступить',
        targetSceneId: 'catacombs',
        effects: { sanity: -2 },
      },
      {
        id: 'carve_return_sigil',
        text: 'Вырезать печать возврата из камня',
        targetSceneId: 'catacombs',
        requirements: { intelligence: 5 },
        effects: {
          sanity: -8,
          corruption: 2,
          addFlag: 'return_sigil',
        },
      },
      {
        id: 'jump_pit',
        text: 'Прошептать одну строку в яму',
        effects: { corruption: 6, sanity: -6, addFlag: 'read_the_writings' },
      },
    ],
  },

  sarcophagus_tunnel: {
    id: 'sarcophagus_tunnel',
    title: 'Вертикальный Склеп',
    description: `
Туннель внутри саркофага уже, чем позволяют твои плечи.

Стены пульсируют медленным, влажным ритмом. Гвозди в камне отмечают путь тех, кто карабкался и не возвращался.

Время от времени из породы давят полые лица — не высеченные, а вспомненные.
    `.trim(),
    options: [
      {
        id: 'submerged_crypt',
        text: 'Карабкаться, пока снова не придёт вода',
        effects: { corruption: 4, sanity: -5 },
      },
      {
        id: 'stone_path',
        text: 'Протиснуться в ответвляющуюся трещину',
        requirements: { agility: 5 },
        effects: { sanity: -3 },
      },
      {
        id: 'communion_vein_corrupt',
        text: 'Протиснуться туда, где стена пульсирует в такт коже',
        targetSceneId: 'communion_vein',
        requirements: { minCorruption: 50 },
        effects: { corruption: 3, sanity: -6 },
      },
      {
        id: 'communion_vein_writings',
        text: 'Следовать за лицами — они смотрят на вскрытую жилу',
        targetSceneId: 'communion_vein',
        requirements: { requiredFlag: 'read_the_writings' },
        effects: { sanity: -4, corruption: 2 },
      },
    ],
  },

  drain_water: {
    id: 'drain_water',
    title: 'Опустошённый Склеп',
    description: `
Ты взламываешь печать саркофага — чёрная вода отступает, как живое существо, пойманное на стыде.

Ил обнажает следы, обрывающиеся на полушаге — словно шедших стёрли, а не утопили.

Ржавая решётка под полом всё ещё дрожит от того, что ты потревожил. Лестница к верхнему кварталу — редкий шанс выбраться живым.
    `.trim(),
    options: [
      {
        id: 'sarcophagus_tunnel',
        text: 'Спуститься через открытую решётку',
        effects: { corruption: 2 },
      },
      {
        id: 'mouth',
        text: 'Карабкаться к верхнему кварталу',
        effects: { sanity: 3 },
      },
    ],
  },

  stone_path: {
    id: 'stone_path',
    title: 'Влажный Склеп',
    description: `
Минеральная вода капает с потолка, слишком высокого, чтобы увидеть.

В склепе гробы сложены вертикально; на каждом — год, который ещё не наступил.

Одна крышка открыта. Внутри — лишь зеркальная вода, отражающая комнату, не эту.
    `.trim(),
    options: [
      {
        id: 'iron_passage',
        text: 'Пройти сквозь зеркальный гроб',
        effects: { sanity: -4, corruption: 2 },
      },
      {
        id: 'descent',
        text: 'Следовать за стоком глубже',
        effects: { corruption: 3 },
      },
    ],
  },

  blood_path: {
    id: 'blood_path',
    title: 'Красный Трансепт',
    description: `
Засохшая кровь пишет писание на каждой поверхности.

Проход открывается в часовню, где скамьи заменены рёбрами, скреплёнными проволокой. Кафедра возвышается над чашей, ещё тёплой от недавнего употребления.

Воздух пахнет железом и исповедью.
    `.trim(),
    options: [
      {
        id: 'encounter_heretic_cog',
        text: 'Подойти к шестерне без оси — она крутится от дыхания',
        targetSceneId: 'encounter_heretic_cog',
        effects: { sanity: -3, corruption: 2, addFlag: 'met_heretic_cog' },
      },
      {
        id: 'jump_pit',
        text: 'Подойти к чаше',
        effects: { corruption: 5, sanity: -6 },
      },
      {
        id: 'monastery',
        text: 'Вернуться наверх по своим следам',
        effects: { sanity: -2 },
      },
    ],
  },

  ash_path: {
    id: 'ash_path',
    title: 'Пепельная Галерея',
    description: `
Холодный пепел покрывает туннель мягкими слоями, глотающими звук.

Рельефы изображают один и тот же шествие через века — всегда та же капюшонная фигура в хвосте, всегда без лица.

В конце галереи бледный дневной свет просачивается сквозь щель уже лезвия — узкий путь назад, если решишь отступить.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Вернуться в глубины',
        effects: { corruption: 2 },
      },
      {
        id: 'exit_monastery',
        text: 'Идти за светом сквозь трещину',
        effects: { sanity: 4, addFlag: 'ash_path_taken' },
      },
    ],
  },
}
