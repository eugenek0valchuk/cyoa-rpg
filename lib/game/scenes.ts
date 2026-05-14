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

  bell: {
    id: 'bell',

    title: 'The Black Bell',

    description: `
Your fingers sink into the wax as if pressing through skin.

The bell does not ring. Instead, every corpse in the monastery begins to whisper in unison — a prayer spoken backwards, syllable by syllable.

Behind the altar, a passage opens into darkness. Stone steps spiral downward into warm, breathing air.

The prayer continues beneath your feet.
    `.trim(),

    options: [
      {
        id: 'catacombs',

        text: 'Descend the spiral steps',

        effects: {
          corruption: 4,

          sanity: -5,
        },
      },

      {
        id: 'exit_monastery',

        text: 'Flee the monastery',

        effects: {
          sanity: -2,
        },
      },
    ],
  },

  catacombs: {
    id: 'catacombs',

    title: 'Catacombs of the First Choir',

    description: `
The catacombs hum with a sound older than music.

Hundreds of wax-sealed alcoves line the walls — each containing a figure in burial robes, hands clasped around an unlit candle.

At the center of the chamber, a pit exhales warm air in steady rhythm, as though the earth itself were breathing.

Carved into the floor: a spiral that matches the bell's wax patterns.
    `.trim(),

    options: [
      {
        id: 'light_candle',

        text: "Light a candle from the pit's breath",

        effects: {
          sanity: 5,

          addArtifact: 'buried_choir_candle',
        },
      },

      {
        id: 'jump_pit',

        text: 'Lower yourself into the breathing pit',

        effects: {
          corruption: 8,

          sanity: -10,
        },
      },

      {
        id: 'read_writings',

        text: 'Read the inscriptions on the walls',

        requirements: {
          intelligence: 6,
        },

        effects: {
          sanity: -5,

          addFlag: 'read_the_writings',
        },
      },
    ],
  },

  descent: {
    id: 'descent',

    title: 'The Warm Dark',

    description: `
The crack widens into a vertical shaft lined with roots and rusted iron rungs.

Each rung is warm, as though the earth below runs with blood.

Far beneath, you hear the wet sound of something massive shifting in the dark.

The blind figures above do not watch you leave. They simply kneel, waiting for whatever returns in your place.
    `.trim(),

    options: [
      {
        id: 'submerged_crypt',

        text: 'Follow the sound of dripping water',

        effects: {
          corruption: 3,
        },
      },

      {
        id: 'iron_passage',

        text: 'Crawl through a narrow iron passage',

        requirements: {
          strength: 5,
        },

        effects: {
          sanity: -4,
        },
      },
    ],
  },

  submerged_crypt: {
    id: 'submerged_crypt',

    title: 'The Flooded Crypt',

    description: `
The passage opens into a crypt half-submerged in black water.

Whatever liquid fills this chamber is heavier than water — it clings to your boots and swallows light.

At the far end, a sarcophagus stands open, its lid propped against the wall.

Inside: not a body, but a vertical tunnel descending further.

The water around the sarcophagus is undisturbed, as though nothing has ever approached it.
    `.trim(),

    options: [
      {
        id: 'sarcophagus_tunnel',

        text: 'Climb into the sarcophagus tunnel',

        effects: {
          corruption: 5,

          sanity: -6,
        },
      },

      {
        id: 'drain_water',

        text: 'Try to drain the chamber',

        requirements: {
          strength: 7,
        },

        effects: {
          sanity: -2,
        },
      },
    ],
  },

  iron_passage: {
    id: 'iron_passage',

    title: 'The Iron Gut',

    description: `
The passage is barely wide enough for your shoulders.

Rust flakes catch on your clothes like red snow.

Ahead, the tunnel splits into three — each identical in shape, each exhaling a different scent: wet stone, dried blood, and cold ash.

The choice is not a choice of paths. It is a question of what you are willing to smell before you arrive.
    `.trim(),

    options: [
      {
        id: 'stone_path',

        text: 'Follow the scent of wet stone',

        effects: {
          sanity: -2,
        },
      },

      {
        id: 'blood_path',

        text: 'Follow the scent of blood',

        effects: {
          corruption: 4,
        },
      },

      {
        id: 'ash_path',

        text: 'Follow the scent of cold ash',

        effects: {
          addFlag: 'ash_path_taken',

          corruption: 2,

          sanity: -3,
        },
      },
    ],
  },

  exit_monastery: {
    id: 'exit_monastery',

    title: 'The Outer Courtyard',

    description: `
You stumble back into the ash-covered road.

The monastery looms behind you, its doorway now sealed with what looks like wax from the inside.

The bell did not ring. But you feel it vibrating in your teeth.

Ahead, the Mouth still waits. The corpse-cart still burns.

The world has not changed. But you have.
    `.trim(),

    options: [
      {
        id: 'mouth',

        text: 'Descend toward the Mouth',

        effects: {
          sanity: -3,
        },
      },

      {
        id: 'merchant',

        text: 'Return to the corpse-cart',

        effects: {
          corruption: 1,
        },
      },
    ],
  },
}
