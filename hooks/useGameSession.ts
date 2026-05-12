'use client'

import { create } from 'zustand'

import { Character, Scene, SceneHistoryEntry, Choice } from '@/lib/types/game'

interface GameSessionState {
  character: Character | null

  currentScene: Scene | null

  sceneHistory: SceneHistoryEntry[]

  visitedScenes: string[]

  setCharacter: (character: Character) => void

  setCurrentScene: (scene: Scene) => void

  pushSceneHistory: (scene: SceneHistoryEntry) => void

  pushHistory: (id: string) => void

  applyChoiceEffects: (choice: Choice) => void

  initializeGame: () => void

  reset: () => void
}

const initialScene: Scene = {
  id: 'intro-crossroads',

  title: 'The Crossroads',

  description: `
Rain falls upon the broken pilgrimage road.

The dead trees bend beneath the wind like kneeling corpses while pale ash drifts across the mud in slow spirals.

Ahead, the road divides.

One path disappears into the Whispering Woods — a forest abandoned after the bells beneath the earth first rang.

The other climbs toward Ironhold Keep, where the last loyalists of the old kingdom sealed themselves behind black iron gates.

Between the roads rests a weary merchant beside a ruined cart.

He watches you silently.

Then slowly raises his lantern.
  `.trim(),

  options: [
    {
      id: 'woods',
      text: 'Walk toward the Whispering Woods',
    },

    {
      id: 'keep',
      text: 'Travel to Ironhold Keep',
    },

    {
      id: 'merchant',
      text: 'Speak with the merchant',
    },
  ],
}

export const useGameSession = create<GameSessionState>((set) => ({
  character: null,

  currentScene: null,

  sceneHistory: [],

  visitedScenes: [],

  setCharacter: (character) =>
    set({
      character,
    }),

  setCurrentScene: (scene) =>
    set({
      currentScene: scene,
    }),

  pushSceneHistory: (scene) =>
    set((state) => ({
      sceneHistory: [...state.sceneHistory, scene],
    })),

  pushHistory: (id) =>
    set((state) => ({
      visitedScenes: [...state.visitedScenes, id],
    })),

  applyChoiceEffects: (choice) =>
    set((state) => {
      if (!state.character) {
        return state
      }

      const effects = choice.effects

      if (!effects) {
        return state
      }

      const inventory = [...state.character.inventory]

      if (effects.addItem) {
        inventory.push(effects.addItem)
      }

      if (effects.removeItem) {
        const index = inventory.indexOf(effects.removeItem)

        if (index !== -1) {
          inventory.splice(index, 1)
        }
      }

      return {
        character: {
          ...state.character,

          sanity: Math.max(
            0,
            Math.min(100, state.character.sanity + (effects.sanity ?? 0)),
          ),

          corruption: Math.max(
            0,
            Math.min(
              100,
              state.character.corruption + (effects.corruption ?? 0),
            ),
          ),

          inventory,

          flags: effects.addFlag
            ? [...state.character.flags, effects.addFlag]
            : state.character.flags,
        },
      }
    }),

  initializeGame: () =>
    set((state) => {
      if (state.currentScene) {
        return state
      }

      return {
        currentScene: initialScene,
      }
    }),

  reset: () =>
    set({
      character: null,

      currentScene: null,

      sceneHistory: [],

      visitedScenes: [],
    }),
}))
