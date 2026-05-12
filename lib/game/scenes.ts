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
          sanity: -2,
        },
      },
    ],
  },

  merchant: {
    id: 'merchant',

    title: 'The Corpse Cart',

    description: `
The hooded merchant does not breathe.

Rotting cloth hangs from his frame while dozens of iron charms sway beneath the cart.

Among bones, funeral candles, and stitched relics rests a blackened iron mask wrapped in chains.

"You already wore it once," the figure whispers.
    `.trim(),

    options: [
      {
        id: 'take_mask',

        text: 'Take the Ashen Faceless Mask',

        effects: {
          addArtifact: 'ashen_faceless_mask',

          corruption: 4,

          addFlag: 'claimed_mask',
        },
      },

      {
        id: 'leave_cart',

        text: 'Leave the corpse-cart behind',

        effects: {
          sanity: -2,
        },
      },
    ],
  },

  take_mask: {
    id: 'take_mask',

    title: 'The Mask Accepts You',

    description: `
The iron mask is freezing to the touch.

As your fingers close around it, every candle surrounding the cart dies instantly.

Far beneath the earth, ancient bells begin ringing once more.

The hooded merchant lowers his head as if mourning something already lost.
    `.trim(),

    options: [
      {
        id: 'mouth',

        text: 'Descend toward the Mouth',

        effects: {
          corruption: 2,
        },
      },

      {
        id: 'monastery',

        text: 'Carry the mask into the monastery',

        effects: {
          sanity: -5,
        },
      },
    ],
  },

  leave_cart: {
    id: 'leave_cart',

    title: 'The Road Continues',

    description: `
You step away from the corpse-cart.

Behind you, the pale fire extinguishes itself.

For a brief moment, you hear iron chains dragging somewhere beneath the road.
    `.trim(),

    options: [
      {
        id: 'mouth',

        text: 'Descend toward the Mouth',

        effects: {},
      },

      {
        id: 'monastery',

        text: 'Enter the Monastery of Hollow Saints',

        effects: {
          corruption: 1,
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
