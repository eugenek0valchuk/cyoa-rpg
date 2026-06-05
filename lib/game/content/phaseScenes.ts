import type { Scene } from '@/lib/types/game'

export const phaseScenes: Record<string, Scene> = {
  descent_echoes: {
    id: 'descent_echoes',
    title: 'Echoes in the Rubble',
    description: `
Collapsed masonry forms a narrow corridor lit by phosphorescent fungus.

Each footstep returns from ahead of you rather than behind, as if someone is walking the same path in reverse.

Scratched into the stone: "Do not answer when your own voice calls."
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Push through the rubble',
        effects: { sanity: -3 },
      },
      {
        id: 'merchant',
        text: 'Wait and listen for the source',
        effects: { corruption: 1 },
      },
    ],
  },

  descent_reliquary: {
    id: 'descent_reliquary',
    title: 'The Broken Reliquary',
    description: `
A shattered reliquary box lies open in the ash.

Inside rests a finger bone wrapped in silk that still sweats despite the cold.

When you approach, the bone points — subtly, deliberately — toward three different exits at once.
    `.trim(),
    options: [
      {
        id: 'monastery',
        text: 'Take the eastern arch',
        effects: { corruption: 2 },
      },
      {
        id: 'descent',
        text: 'Take the downward stair',
        effects: { sanity: -4 },
      },
    ],
  },

  whispers_parlor: {
    id: 'whispers_parlor',
    title: 'The Whispering Parlor',
    description: `
A room of overturned chairs arranged in a perfect circle.

Voices debate your next decision from empty seats, each insisting it knows what you will choose.

The argument ends when they all speak your name at once.
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Follow the loudest voice',
        effects: { corruption: 3, sanity: -5 },
      },
      {
        id: 'exit_monastery',
        text: 'Leave without choosing',
        effects: { sanity: -2 },
      },
    ],
  },

  whispers_mirror: {
    id: 'whispers_mirror',
    title: 'The Tarnished Mirror',
    description: `
A full-length mirror stands alone in a flooded hallway.

Your reflection kneels one second before you do. When you stand, it remains kneeling, head tilted as if listening to the floor.

Cracks in the glass spell out coordinates only the reflection can read.
    `.trim(),
    options: [
      {
        id: 'catacombs',
        text: 'Shatter the mirror',
        effects: { sanity: -6, corruption: 2 },
      },
      {
        id: 'iron_passage',
        text: 'Read the coordinates aloud',
        requirements: { intelligence: 6 },
        effects: { corruption: 4 },
      },
    ],
  },

  fracture_stairs: {
    id: 'fracture_stairs',
    title: 'Stairs That Forget',
    description: `
These steps change number each time you blink.

You count thirteen, then nine, then more than you can hold in memory.

A child-sized handprint on the rail is still warm.
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Climb down anyway',
        effects: { sanity: -7, corruption: 3 },
      },
      {
        id: 'mouth',
        text: 'Run back to stable ground',
        effects: { sanity: -3 },
      },
    ],
  },

  fracture_choir: {
    id: 'fracture_choir',
    title: 'The Split Choir',
    description: `
Two identical choirs sing from opposite sides of a cracked nave.

Both claim to be the real congregation. Both stop when you cover one ear and continue when you cover both.

The hymn describes your arrival before you take your first step inside.
    `.trim(),
    options: [
      {
        id: 'bell',
        text: 'Join the left choir',
        effects: { corruption: 5 },
      },
      {
        id: 'light_candle',
        text: 'Join the right choir',
        effects: { sanity: -5, corruption: 3 },
      },
    ],
  },

  communion_vein: {
    id: 'communion_vein',
    title: 'The Open Vein',
    description: `
The wall has been flayed.

Beneath stone runs a luminous channel of slow-moving light that responds to touch like living tissue.

It offers warmth, clarity, and the absolute certainty that you belong inside it.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Place your hand in the channel',
        effects: { corruption: 8, sanity: -8 },
      },
      {
        id: 'blood_path',
        text: 'Cut a sample free',
        requirements: { strength: 6 },
        effects: { corruption: 6, sanity: -4 },
      },
    ],
  },

  communion_throne: {
    id: 'communion_throne',
    title: 'The Empty Throne',
    description: `
A throne of fused vertebrae waits in a chamber that smells of incense and surgery.

It is sized for you. It has always been sized for you.

When you refuse to sit, the room rearranges until refusal becomes impossible geometry.
    `.trim(),
    options: [
      {
        id: 'sarcophagus_tunnel',
        text: 'Sit for one heartbeat',
        effects: { corruption: 10, sanity: -10 },
      },
      {
        id: 'ash_path',
        text: 'Break the armrests and flee',
        requirements: { strength: 7 },
        effects: { sanity: -5, corruption: 4 },
      },
    ],
  },

  collapse_threshold: {
    id: 'collapse_threshold',
    title: 'The Unmaking Threshold',
    description: `
Reality thins to parchment.

You see every version of this corridor stacked atop one another — each showing a different corpse wearing your clothes.

The versions begin to merge. Soon there will only be one outcome left.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Step into the merged outcome',
        effects: { corruption: 12, sanity: -12 },
      },
      {
        id: 'read_writings',
        text: 'Recite what you remember of yourself',
        requirements: { intelligence: 7 },
        effects: { sanity: 5, corruption: 5 },
      },
    ],
  },

  collapse_maw: {
    id: 'collapse_maw',
    title: 'The Final Antechamber',
    description: `
The architecture ends here.

Beyond the last arch is not darkness but absence — a space where even fear cannot form.

Something vast notices your attention and turns toward you with the patience of geology.
    `.trim(),
    options: [
      {
        id: 'descent',
        text: 'Approach the absence',
        effects: { corruption: 15, sanity: -15 },
      },
      {
        id: 'exit_monastery',
        text: 'Cling to the last solid stone',
        effects: { sanity: -8 },
      },
    ],
  },
}
