import type { Artifact } from '@/lib/types/game'

export const artifacts: Record<string, Artifact> = {
  ashen_faceless_mask: {
    id: 'ashen_faceless_mask',

    name: 'Ashen Faceless Mask',

    rarity: 'forbidden',

    description: 'A funeral mask with no openings for eyes or mouth.',

    lore: 'Witnesses claim the Procession wears identical faces beneath the ash.',

    whisper: [
      'You have already walked this road.',
      'Do not turn when the bells stop.',
      'The bells remember your face.',
    ],

    effects: {
      sanity: -6,
      corruption: 4,
    },
  },

  buried_choir_candle: {
    id: 'buried_choir_candle',

    name: 'Candle of the Buried Choir',

    rarity: 'rare',

    description: 'A pale candle that burns with cold and silent flame.',

    lore: 'The buried choirs once carried these beneath the lower cathedral.',

    whisper: [
      'The choir still sings below.',
      'Do not listen to the final verse.',
    ],

    effects: {
      corruption: 2,
    },
  },

  black_vertebrae: {
    id: 'black_vertebrae',

    name: 'Black Vertebrae',

    rarity: 'mythic',

    description: 'A human vertebra darkened into something harder than iron.',

    lore: 'Some believe the Abyss first learned to speak through bone.',

    whisper: [
      'The world bends around the wound.',
      'You are descending correctly.',
    ],

    effects: {
      sanity: -10,
      corruption: 8,
    },
  },

  inverted_rosary: {
    id: 'inverted_rosary',

    name: 'Inverted Rosary',

    rarity: 'forbidden',

    description: 'Prayer beads carved with symbols facing inward.',

    lore: 'Heretics whisper the prayers backwards until language collapses.',

    whisper: [
      'The saints were never listening.',
      'Silence is older than faith.',
    ],

    effects: {
      corruption: 5,
    },
  },

  drowned_bell_fragment: {
    id: 'drowned_bell_fragment',

    name: 'Drowned Bell Fragment',

    rarity: 'rare',

    description:
      'A broken shard from a bell recovered beneath flooded streets.',

    lore: 'Some bells continue ringing long after they are shattered.',

    whisper: ['The water remembers every name.'],

    effects: {
      sanity: -2,
    },
  },
}
