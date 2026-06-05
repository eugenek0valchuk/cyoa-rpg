import type { Artifact } from '@/lib/types/game'

export const artifacts: Record<string, Artifact> = {
  ashen_faceless_mask: {
    id: 'ashen_faceless_mask',
    name: 'Пепельная Безликая Маска',
    rarity: 'forbidden',
    imageSrc: '/artifacts/ashen-faceless-mask.png',
    description: 'Погребальная маска без прорезей для глаз и рта.',
    lore: 'Свидетели утверждают: у Шествия под пеплом — одинаковые лица.',
    whisper: [
      'Ты уже ходил этой дорогой.',
      'Не оборачивайся, когда колокола замолкают.',
      'Колокола помнят твоё лицо.',
    ],
    effects: { sanity: -4, corruption: 3 },
    onAcquire: { sanity: -2, corruption: 1 },
  },

  buried_choir_candle: {
    id: 'buried_choir_candle',
    name: 'Свеча Закопанного Хора',
    rarity: 'rare',
    imageSrc: '/artifacts/buried-choir-candle.png',
    description: 'Бледная свеча, горящая холодным беззвучным пламенем.',
    lore: 'Закопанные хоры когда-то несли их под нижним собором.',
    whisper: ['Хор всё ещё поёт внизу.', 'Не слушай последний стих.'],
    effects: { corruption: 1 },
    onAcquire: { corruption: 1 },
  },

  black_vertebrae: {
    id: 'black_vertebrae',
    name: 'Чёрный Позвонок',
    rarity: 'mythic',
    imageSrc: '/artifacts/black-vertebrae.png',
    description: 'Человеческий позвонок, почерневший и ставший твёрже железа.',
    lore: 'Говорят, бездна впервые научилась говорить через кость.',
    whisper: ['Мир искривляется вокруг раны.', 'Ты спускаешься правильно.'],
    effects: { sanity: -6, corruption: 5, strength: 1 },
    onAcquire: { sanity: -4, corruption: 3 },
  },

  inverted_rosary: {
    id: 'inverted_rosary',
    name: 'Перевёртыш Чёток',
    rarity: 'forbidden',
    imageSrc: '/artifacts/inverted-rosary.png',
    description: 'Чётки с символами, вырезанными лицом внутрь.',
    lore: 'Еретики шепчут молитвы задом наперёд, пока язык не ломается.',
    whisper: ['Святые никогда не слушали.', 'Тишина старше веры.'],
    effects: { corruption: 3, intelligence: 1 },
    onAcquire: { corruption: 2 },
  },

  drowned_bell_fragment: {
    id: 'drowned_bell_fragment',
    name: 'Осколок Утонувшего Колокола',
    rarity: 'rare',
    imageSrc: '/artifacts/drowned-bell-fragment.png',
    description: 'Сломанный осколок колокола, поднятый из затопленных улиц.',
    lore: 'Некоторые колокола звонят долго после того, как их разбили.',
    whisper: ['Вода помнит каждое имя.'],
    effects: { sanity: -1 },
    onAcquire: { sanity: -1 },
  },
}
