import { create } from 'zustand'

import { persist } from 'zustand/middleware'

import type { Character, CharacterStats } from '../types/game'

interface CharacterStore {
  character: Character | null

  setCharacter: (char: Character) => void

  updateStats: (stats: Partial<CharacterStats>) => void

  updateSanity: (amount: number) => void

  updateCorruption: (amount: number) => void

  addToInventory: (item: string) => void

  removeFromInventory: (item: string) => void

  addFlag: (flag: string) => void

  resetCharacter: () => void
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      character: null,

      setCharacter: (char) =>
        set({
          character: char,
        }),

      updateStats: (stats) =>
        set((state) => {
          if (!state.character) {
            return {
              character: null,
            }
          }

          return {
            character: {
              ...state.character,

              stats: {
                strength: state.character.stats.strength + (stats.strength ?? 0),

                agility: state.character.stats.agility + (stats.agility ?? 0),

                intelligence: state.character.stats.intelligence + (stats.intelligence ?? 0),
              },
            },
          }
        }),

      updateSanity: (amount) =>
        set((state) => {
          if (!state.character) {
            return {
              character: null,
            }
          }

          return {
            character: {
              ...state.character,

              sanity: Math.max(0, Math.min(100, state.character.sanity + amount)),
            },
          }
        }),

      updateCorruption: (amount) =>
        set((state) => {
          if (!state.character) {
            return {
              character: null,
            }
          }

          return {
            character: {
              ...state.character,

              corruption: Math.max(0, Math.min(100, state.character.corruption + amount)),
            },
          }
        }),

      addToInventory: (item) =>
        set((state) => {
          if (!state.character) {
            return {
              character: null,
            }
          }

          return {
            character: {
              ...state.character,

              inventory: [...state.character.inventory, item],
            },
          }
        }),

      removeFromInventory: (item) =>
        set((state) => {
          if (!state.character) {
            return {
              character: null,
            }
          }

          return {
            character: {
              ...state.character,

              inventory: state.character.inventory.filter(
                (inventoryItem) => inventoryItem !== item,
              ),
            },
          }
        }),

      addFlag: (flag) =>
        set((state) => {
          if (!state.character) {
            return {
              character: null,
            }
          }

          if (state.character.flags.includes(flag)) {
            return {
              character: state.character,
            }
          }

          return {
            character: {
              ...state.character,

              flags: [...state.character.flags, flag],
            },
          }
        }),

      resetCharacter: () =>
        set({
          character: null,
        }),
    }),

    {
      name: 'descent-character-storage',

      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          character?: Character
        }

        return {
          ...currentState,

          ...persisted,

          character: persisted?.character
            ? {
                ...persisted.character,

                sanity: persisted.character.sanity ?? 100,

                corruption: persisted.character.corruption ?? 0,

                flags: persisted.character.flags ?? [],
              }
            : null,
        }
      },
    },
  ),
)
