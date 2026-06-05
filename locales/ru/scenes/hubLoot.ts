import type { Scene } from '@/lib/types/game'

export const hubLootScenes: Record<string, Scene> = {
  loot_iron_cache: {
    id: 'loot_iron_cache',
    title: 'Кеш под Ступенями',
    description: `
Под ступенями — **железный** ящик без замка. Внутри осколки с зубьев шестерни и обломки цепи.

Камера примет их как деталь — не реликвию. На крышке царапина: «для лампы».
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Взять осколки и идти глубже',
        effects: { addMaterials: { iron_shard: 1 } },
      },
      {
        id: 'mouth',
        text: 'Взять и вернуться к Устам',
        effects: { addMaterials: { iron_shard: 1 }, sanity: -1 },
      },
    ],
  },

  loot_wax_bundle: {
    id: 'loot_wax_bundle',
    title: 'Пучок Восковых Печатей',
    description: `
У телеги, в тени, лежит **пучок** восковых печатей — сняты с паломников, ещё тёплые.

Бездыханный не смотрит. «Бери. Синод не считает то, что не успело высохнуть.»
    `.trim(),
    options: [
      {
        id: 'merchant',
        text: 'Спрятать печати в камеру',
        effects: { addMaterials: { wax_seal: 1 }, addFlag: 'met_breathless' },
      },
      {
        id: 'mouth',
        text: 'Взять одну и спуститься',
        effects: { addMaterials: { wax_seal: 1 } },
      },
    ],
  },

  loot_folio_shelf: {
    id: 'loot_folio_shelf',
    title: 'Полка с Фолиантом',
    description: `
В монастырской нише — полка. Синод **стёр** книгу, но **страницы** выпали за плинтус.

На первой: «Камера — не храм». На второй: «Смотрящий вниз — свидетель». Третья обуглена.
    `.trim(),
    options: [
      {
        id: 'monastery',
        text: 'Собрать страницы в свиток',
        effects: { addMaterials: { folio_page: 1 } },
      },
      {
        id: 'catacombs',
        text: 'Взять страницы и уйти в катакомбы',
        effects: { addMaterials: { folio_page: 1 }, corruption: 1 },
      },
    ],
  },

  loot_choir_splinter: {
    id: 'loot_choir_splinter',
    title: 'Щепка из Хора',
    description: `
У Расколотого хора — **щепка** кости, похожая на ноту. Она всё ещё вибрирует тихим гимном.

Камера сможет встроить её в полку памяти — чтобы реликвии не забывались между петлями.
    `.trim(),
    options: [
      {
        id: 'fracture_choir',
        text: 'Взять щепку и слушать дальше',
        effects: { addMaterials: { choir_splinter: 1 }, sanity: -3 },
      },
      {
        id: 'bell',
        text: 'Взять щепку и уйти к колоколу',
        effects: { addMaterials: { choir_splinter: 1 } },
      },
    ],
  },
}
