import { Scene } from '../types/game'

export const scenes: Record<string, Scene> = {
  start: {
    id: 'start',

    title: 'The Crossroads',

    description: `
Rain falls upon the ruined pilgrimage road.

Rotting prayer banners sway from dead trees while pale ash drifts slowly across the mud.

Ahead, the road divides.

One path disappears into the Whispering Woods — a place abandoned after the bells beneath the earth first rang.

The other climbs toward Ironhold Keep, where the final knights of the old kingdom sealed themselves behind iron gates.

Between the roads sits a weary merchant beside a broken cart.

His lantern burns with pale blue fire.
    `.trim(),

    options: [
      {
        id: 'woods',

        text: 'Walk into the Whispering Woods',

        effects: {
          sanity: -5,
        },
      },

      {
        id: 'keep',

        text: 'Travel toward Ironhold Keep',

        effects: {
          corruption: 2,
        },
      },

      {
        id: 'merchant',

        text: 'Speak with the lantern merchant',

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

  woods: {
    id: 'woods',

    title: 'The Whispering Woods',

    description: `
The forest swallows the road behind you.

No wind moves between the trees, yet the branches creak softly above like distant voices speaking in prayer.

You eventually discover an ancient stone spring hidden beneath roots and moss.

The water reflects no sky.

Only darkness.
    `.trim(),

    options: [
      {
        id: 'drink',

        text: 'Drink from the black water',

        effects: {
          sanity: -10,

          corruption: 5,
        },
      },

      {
        id: 'leave',

        text: 'Step away from the spring',

        effects: {},
      },
    ],
  },

  keep: {
    id: 'keep',

    title: 'Ironhold Keep',

    description: `
The gates of Ironhold rise from the fog like the jaws of some sleeping beast.

Black iron chains hang from the ruined towers while silent guards watch from above without moving.

At the center of the courtyard waits an old knight wrapped in rusted armor.

He lowers his blade toward you.
    `.trim(),

    options: [
      {
        id: 'fight',

        text: 'Accept the knight’s challenge',

        effects: {
          corruption: 3,

          addFlag: 'faced_the_knight',
        },
      },

      {
        id: 'flee',

        text: 'Retreat back into the fog',

        effects: {
          sanity: -3,
        },
      },
    ],
  },
}
