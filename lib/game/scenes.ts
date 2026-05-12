import type { Scene } from '../types/game'

export const scenes: Record<string, Scene> = {
  start: {
    id: 'start',

    title: 'The Pilgrim Road',

    description: `
Ash falls like snow upon the dead road.

The bells beneath the earth have not rung for nineteen nights, yet the pilgrims still kneel facing the cracks in the ground.

Ahead, the path descends toward the buried district known as the Mouth.

To the east stands the Monastery of Hollow Saints — abandoned after the Procession.

A hooded figure waits beside a corpse-cart lit by pale fire.
    `.trim(),

    options: [
      {
        id: 'mouth',

        text: 'Descend toward the Mouth',

        effects: {
          sanity: -5,
        },
      },

      {
        id: 'monastery',

        text: 'Enter the Monastery of Hollow Saints',

        effects: {
          corruption: 2,
        },
      },

      {
        id: 'merchant',

        text: 'Approach the corpse-cart',

        requirements: {
          intelligence: 5,
        },

        effects: {
          addItem: 'Lantern Sigil',

          sanity: -2,
        },
      },
    ],
  },

  mouth: {
    id: 'mouth',

    title: 'The Mouth',

    description: `
The district beneath the road reeks of wet ash and old blood.

Broken bells hang above collapsed archways while blind figures kneel in silence around enormous cracks descending into darkness.

Something breathes below.
    `.trim(),

    options: [
      {
        id: 'descent',

        text: 'Climb into the abyss',

        effects: {
          corruption: 6,

          sanity: -10,
        },
      },
    ],
  },

  monastery: {
    id: 'monastery',

    title: 'Monastery of Hollow Saints',

    description: `
The monastery doors stand open.

Rows of kneeling corpses remain untouched beneath layers of dust.

At the altar hangs a massive iron bell covered in black wax.

You hear movement behind the walls.
    `.trim(),

    options: [
      {
        id: 'bell',

        text: 'Touch the black bell',

        effects: {
          corruption: 8,

          addFlag: 'heard_the_bell',
        },
      },
    ],
  },
}
