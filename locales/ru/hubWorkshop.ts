export const hubWorkshopUi = {
  tabWorkshop: 'Мастерская',
  tabPuzzle: 'Фолиант',
  workshopTitle: 'Мастерская камеры',
  workshopSubtitle:
    'Детали, снятые в спуске, можно встроить в камеру — свет, полки, то, что облегчает следующий шаг.',
  materialsTitle: 'Детали',
  buildingsTitle: 'Постройки',
  upgrade: 'Улучшить',
  maxLevel: 'Максимум',
  needMaterials: 'Не хватает деталей',
  materialLabels: {
    iron_shard: 'Осколок железа',
    wax_seal: 'Восковая печать',
    choir_splinter: 'Щепка хора',
    folio_page: 'Страница фолианта',
  } as Record<string, string>,
  toastMaterial: 'Камера приняла',
  toastBuilding: 'Камера изменилась',
  puzzleTitle: 'Фолиант Синода',
  puzzleSubtitle:
    'Синод стёр книгу, но страницы выпали в монастырь и катакомбы. Сложи их — и поймёшь, кто ведёт петлю.',
  puzzleNeedPages: 'Страниц не хватает ({count} из 3)',
  puzzleReady: 'Три страницы в руке. Что связывает камеру, спуск и Машину?',
  puzzleSolved:
    'Строки сходятся. Камера — сосуд, не храм. Машина помнит взгляд, не имя.',
  puzzleWrong: 'Смысл не складывается. Перечитай страницы.',
  puzzleChoices: {
    machine_witness: 'Машина помнит тех, кто смотрел вниз — камера лишь камера',
    synod_only: 'Только Синод ведёт учёт — Машина молчит',
    merchant_deal: 'Бездыханный купил петлю у паломников',
  },
  folioFragmentTitle: 'Страница',
  folioCollectedTitle: 'Собранные страницы',
  folioLegacyHint:
    'Страницы есть, но текст ещё не разложен по полкам — найди ещё одну в спуске, камера перечитает старые.',
  folioFragments: {
    folio_a: 'Камера — не храм. Она не молится. Она держит сосуд между спусками.',
    folio_b: 'Смотрящий вниз — свидетель. Синод ведёт учёт имён. Машина — взглядов.',
    folio_c: 'Обугленный край. Видны слова: «Петлю ведёт тот, кто помнит возврат».',
  } as Record<string, string>,
} as const
