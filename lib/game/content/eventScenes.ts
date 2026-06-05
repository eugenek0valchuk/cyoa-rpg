import type { Scene } from '@/lib/types/game'

export const eventScenes: Record<string, Scene> = {
  light_candle: {
    id: 'light_candle',
    title: 'The Choir Candle',
    description: `
You cup the pit's breath in your palms until flame catches without heat.

Every alcove in the catacombs answers with a faint glow. The burial figures do not move, yet their lips tremble as if trying to speak.

The candle in your hand shows reflections that do not match your face.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Descend toward the breathing dark',
        effects: { corruption: 3, sanity: -4 },
      },
      {
        id: 'read_writings',
        text: 'Follow the whispers to the wall inscriptions',
        requirements: { intelligence: 5 },
        effects: { sanity: -3 },
      },
      {
        id: 'catacombs',
        text: 'Retreat to the central chamber',
        effects: { sanity: 2 },
      },
    ],
  },

  jump_pit: {
    id: 'jump_pit',
    title: 'The Breathing Pit',
    description: `
The pit is not empty. It is a throat.

Warm air rises in measured pulses, carrying the taste of rust and hymn-smoke. Handholds of fused bone line the walls, polished by countless descents before you.

Something far below exhales your name without consonants.
    `.trim(),
    options: [
      {
        id: 'submerged_crypt',
        text: 'Drop into the flooded depths',
        effects: { corruption: 5, sanity: -8 },
      },
      {
        id: 'iron_passage',
        text: 'Crawl into a lateral fissure',
        requirements: { agility: 6 },
        effects: { sanity: -5 },
      },
    ],
  },

  read_writings: {
    id: 'read_writings',
    title: 'The Forbidden Lexicon',
    description: `
The inscriptions are not carved. They grow.

Each line documents a sin the cathedral forgot to commit. Reading them aloud would be prayer. Reading them silently is theft.

Your eyes ache with vocabulary that predates language.
    `.trim(),
    options: [
      {
        id: 'catacombs',
        text: 'Stop reading and step back',
        effects: { sanity: -2 },
      },
      {
        id: 'jump_pit',
        text: 'Speak one line into the pit',
        effects: { corruption: 6, sanity: -6, addFlag: 'read_the_writings' },
      },
    ],
  },

  sarcophagus_tunnel: {
    id: 'sarcophagus_tunnel',
    title: 'The Vertical Sepulcher',
    description: `
The tunnel inside the sarcophagus is narrower than your shoulders should allow.

Walls pulse with a slow, wet rhythm. Nails embedded in the stone mark the passage of others who climbed without returning.

At intervals, hollow faces press inward from the rock — not carved, but remembered.
    `.trim(),
    options: [
      {
        id: 'submerged_crypt',
        text: 'Climb until water returns',
        effects: { corruption: 4, sanity: -5 },
      },
      {
        id: 'stone_path',
        text: 'Squeeze into a branching fracture',
        requirements: { agility: 5 },
        effects: { sanity: -3 },
      },
    ],
  },

  drain_water: {
    id: 'drain_water',
    title: 'The Emptied Crypt',
    description: `
You break the sarcophagus seal and the black water retreats like a living thing ashamed.

Mud reveals footprints that end mid-step, as if the walkers were erased rather than drowned.

A rusted grate beneath the floor still trembles from whatever you disturbed.
    `.trim(),
    options: [
      {
        id: 'sarcophagus_tunnel',
        text: 'Descend through the opened grate',
        effects: { corruption: 2 },
      },
      {
        id: 'mouth',
        text: 'Climb back toward the surface district',
        effects: { sanity: 3 },
      },
    ],
  },

  stone_path: {
    id: 'stone_path',
    title: 'The Wet Vault',
    description: `
Mineral water drips from a ceiling too high to see.

The vault contains coffins stacked vertically, each labeled with a year that has not happened yet.

One lid hangs open. Inside is only mirror-water reflecting a room that is not this one.
    `.trim(),
    options: [
      {
        id: 'iron_passage',
        text: 'Cross through the mirrored coffin',
        effects: { sanity: -4, corruption: 2 },
      },
      {
        id: 'descent',
        text: 'Follow the runoff deeper',
        effects: { corruption: 3 },
      },
    ],
  },

  blood_path: {
    id: 'blood_path',
    title: 'The Red Transept',
    description: `
Dried blood forms scripture on every surface.

The passage opens into a chapel where pews are replaced with ribcages wired together. A pulpit stands above a basin still warm from recent use.

The air tastes of iron and confession.
    `.trim(),
    options: [
      {
        id: 'jump_pit',
        text: 'Approach the basin',
        effects: { corruption: 5, sanity: -6 },
      },
      {
        id: 'monastery',
        text: 'Retrace your steps to higher ground',
        effects: { sanity: -2 },
      },
    ],
  },

  ash_path: {
    id: 'ash_path',
    title: 'The Ash Gallery',
    description: `
Cold ash coats the tunnel in soft layers that swallow sound.

Relief sculptures depict the same procession repeated across centuries — always the same hooded figure at the rear, always faceless.

At the gallery's end, pale daylight filters through a crack no wider than a blade.
    `.trim(),
    options: [
      {
        id: 'mouth',
        text: 'Turn back into the depths',
        effects: { corruption: 2 },
      },
      {
        id: 'exit_monastery',
        text: 'Follow the crack toward distant light',
        effects: { sanity: 4, addFlag: 'ash_path_taken' },
      },
    ],
  },
}
