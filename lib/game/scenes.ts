import { Scene } from '../types/game'

export const scenes: Record<string, Scene> = {
  start: {
    id: 'start',
    title: 'The Crossroads',
    description: `You stand at a dusty crossroads. A signpost points west to "Whispering Woods" and east to "Ironhold Keep". 
A tired merchant rests by the roadside, mending his cart.`,
    options: [
      {
        id: 'woods',
        text: 'Go west into the Whispering Woods',
        effects: { agility: 1 },
      },
      {
        id: 'keep',
        text: 'Head east to Ironhold Keep',
        effects: { strength: 1 },
      },
      {
        id: 'merchant',
        text: 'Talk to the merchant',
        requires: (char) => char.stats.intelligence >= 5,
        effects: { intelligence: 1 },
      },
    ],
  },
  woods: {
    id: 'woods',
    title: 'Whispering Woods',
    description: `The trees whisper secrets as you pass. You find a hidden spring. Do you drink?`,
    options: [
      {
        id: 'drink',
        text: 'Drink from the spring',
        effects: { strength: 1, agility: 1 },
      },
      {
        id: 'leave',
        text: 'Leave the spring and go back',
        effects: {},
      },
    ],
  },
  keep: {
    id: 'keep',
    title: 'Ironhold Keep',
    description: `The guard captain eyes you. "Prove your worth in the training yard."`,
    options: [
      {
        id: 'fight',
        text: 'Accept the challenge',
        effects: { strength: 2 },
      },
      {
        id: 'flee',
        text: 'Run back to the crossroads',
        effects: { agility: 1 },
      },
    ],
  },
}
