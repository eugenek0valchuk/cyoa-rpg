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

«Я пишу то, что сосуд не успевает. Каждый твой возврат — новая буква на стене.» Хронист указывает на пепел, где свежие строки ещё пахнут железом. «Спроси — отвечу честно. Камера не любит лесть.»

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

  encounter_procession_herald: {
    id: 'encounter_procession_herald',
    title: 'Вестник Обочины',
    description: `
Из тумана Шествия отделяется **один** паломник — не в строю, на обочине.

Восковая маска ещё тёплая. Он не смотрит на тебя — смотрит **мимо**, туда, где ты стоял в ту ночь. «Свидетель, — говорит он без дыхания. — Обочина помнит. Шествие — **нет**. Запиши разницу.»

На палке — насечки: каждая для тех, кто смотрел, но не пошёл.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Принять насечку — спуститься',
        effects: { sanity: -3, corruption: 2, addFlag: 'procession_witness' },
      },
      {
        id: 'monastery',
        text: 'Спросить, куда ушло Шествие',
        targetSceneId: 'procession_herald_answer',
        effects: { sanity: -2 },
      },
      {
        id: 'merchant',
        text: 'Отдать насечку Бездыханному',
        effects: { sanity: -1, addFlag: 'met_breathless' },
      },
    ],
  },

  procession_herald_answer: {
    id: 'procession_herald_answer',
    title: 'Куда Ушло Шествие',
    description: `
«В **трещину**, — отвечает вестник. — Туда, где колокол бил в последний раз.» Он касается твоей ладони воском — не больно, **честно**. «Ты остался. Значит, долг не в шаге. Долг в **взгляде**.»

Туман сгущается. Шествие уже далеко — но обочина ещё тепла.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Идти вниз с этим ответом',
        effects: { sanity: -4, corruption: 2, addFlag: 'procession_witness' },
      },
      {
        id: 'bell',
        text: 'К колоколу — услышать последний удар',
        effects: { sanity: -3, addFlag: 'heard_the_bell' },
      },
    ],
  },

  encounter_ash_weaver: {
    id: 'encounter_ash_weaver',
    title: 'Пепельница',
    description: `
Старуха в сером вуале **плетёт** из пепла — нити держатся, пока на них смотрят.

«Память камеры рвётся. Я шью обрывки — **не** для Синода.» Между пальцами проступает лицо, которое ты почти забыл. «Еретик платит формулой. Свидетель — взглядом. Пустой — **дырой**. Что принесёшь?»

Свеча коптит. Пепел пахнет воском Шествия.
    `.trim(),
    options: [
      {
        id: 'read_writings',
        text: 'Отдать строку со стены — принять шов',
        effects: { corruption: 4, sanity: -3, addFlag: 'ash_weaver_met' },
      },
      {
        id: 'catacombs',
        text: 'Взять нить памяти в катакомбы',
        effects: { sanity: -4, corruption: 2, addFlag: 'ash_weaver_met' },
      },
      {
        id: 'monastery',
        text: 'Отказаться — часовня ближе',
        effects: { sanity: 2 },
      },
    ],
  },

  encounter_mirror_nun: {
    id: 'encounter_mirror_nun',
    title: 'Зеркальная Монахиня',
    description: `
Монахиня Полых Святых стоит без лица — вместо него **бронзовое зеркало**.

В отражении нет тебя. Есть **форма** — пустая, честная. «Мы вырезали лишнее, — говорит она. — Ты родился лишним. Синод злится. Машина — **понимает**.»

Зеркало холодное. За спиной колокол молчит — редкость для монастыря.
    `.trim(),
    options: [
      {
        id: 'whispers_mirror',
        text: 'Смотреть в зеркало — принять форму',
        effects: { sanity: -4, corruption: 3, addFlag: 'mirror_nun_met' },
      },
      {
        id: 'monastery',
        text: 'Клониться и уйти в часовню',
        effects: { sanity: 3 },
      },
      {
        id: 'mouth',
        text: 'Спуститься — форма держит без имени',
        effects: { corruption: 2, sanity: -2 },
      },
    ],
  },

  encounter_iron_keeper: {
    id: 'encounter_iron_keeper',
    title: 'Железный Хранитель',
    description: `
На третьем ярусе стоит страж в **железной маске** — на ней выгравированы чужие имена.

«Глубина помнит не голоса — **имена**.» Он открывает книгу из металла. Страница пустая — ждёт твоей строки. «Свидетель пишет чужое. Еретик — формулу. Пустой — **ноль**.»

Ступени под ногами считают долги, не шаги.
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Записать строку и спуститься глубже',
        effects: { corruption: 4, sanity: -4, addFlag: 'iron_keeper_met' },
      },
      {
        id: 'catacombs',
        text: 'Сорвать страницу — уйти в катакомбы',
        effects: { sanity: -5, corruption: 3, addFlag: 'iron_keeper_met' },
      },
      {
        id: 'iron_passage',
        text: 'Идти железным коридором',
        effects: { sanity: -3, corruption: 2 },
      },
    ],
  },

  encounter_vein_prophet: {
    id: 'encounter_vein_prophet',
    title: 'Пророк Жилы',
    description: `
У трона в жиле сидит фигура — кожа **просвечивает**, как карта спуска.

«Уста дышат не вниз — **внутрь**.» Голос без эха. «Еретик, ты уже ответил Машине. Теперь спроси **жилу**: что останется, когда формула сгорит?» Синод здесь не слышит. Колокол — тоже.

Камень пульсирует в такт твоему пульсу — или ты в такт камню.
    `.trim(),
    options: [
      {
        id: 'communion_throne',
        text: 'Сесть у трона — услышать жилу',
        effects: { corruption: 6, sanity: -6, addFlag: 'vein_prophet_met' },
      },
      {
        id: 'collapse_threshold',
        text: 'Шагнуть к Порогу Распада',
        effects: { corruption: 4, sanity: -4, addFlag: 'vein_prophet_met' },
      },
      {
        id: 'mouth',
        text: 'Вернуться к Устам — не садиться',
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
