import type { Artifact } from '@/lib/types/game'

export const artifacts: Record<string, Artifact> = {
  ashen_faceless_mask: {
    id: 'ashen_faceless_mask',
    name: 'Пепельная Безликая Маска',
    rarity: 'forbidden',
    description: 'Погребальная маска без прорезей для глаз и рта.',
    lore: 'Свидетели утверждают: у Шествия под пеплом — одинаковые лица.',
    whisper: [
      'Ты уже ходил этой дорогой.',
      'Не оборачивайся, когда колокола замолкают.',
      'Колокола помнят твоё лицо.',
    ],
    effects: { sanity: -6, corruption: 4 },
  },

  buried_choir_candle: {
    id: 'buried_choir_candle',
    name: 'Свеча Закопанного Хора',
    rarity: 'rare',
    description: 'Бледная свеча, горящая холодным беззвучным пламенем.',
    lore: 'Закопанные хоры когда-то несли их под нижним собором.',
    whisper: ['Хор всё ещё поёт внизу.', 'Не слушай последний стих.'],
    effects: { corruption: 2 },
  },

  black_vertebrae: {
    id: 'black_vertebrae',
    name: 'Чёрный Позвонок',
    rarity: 'mythic',
    description: 'Человеческий позвонок, почерневший и ставший твёрже железа.',
    lore: 'Говорят, бездна впервые научилась говорить через кость.',
    whisper: ['Мир искривляется вокруг раны.', 'Ты спускаешься правильно.'],
    effects: { sanity: -10, corruption: 8 },
  },

  inverted_rosary: {
    id: 'inverted_rosary',
    name: 'Перевёртыш Чёток',
    rarity: 'forbidden',
    description: 'Чётки с символами, вырезанными лицом внутрь.',
    lore: 'Еретики шепчут молитвы задом наперёд, пока язык не ломается.',
    whisper: ['Святые никогда не слушали.', 'Тишина старше веры.'],
    effects: { corruption: 5 },
  },

  drowned_bell_fragment: {
    id: 'drowned_bell_fragment',
    name: 'Осколок Утонувшего Колокола',
    rarity: 'rare',
    description: 'Сломанный осколок колокола, поднятый из затопленных улиц.',
    lore: 'Некоторые колокола звонят долго после того, как их разбили.',
    whisper: ['Вода помнит каждое имя.'],
    effects: { sanity: -2 },
  },
}
