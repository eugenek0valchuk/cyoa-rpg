import { create } from 'zustand'

import type { Artifact, Character } from '@/lib/types/game'

interface CharacterStore {
  character: Character | null

  setCharacter: (character: Character) => void

  updateSanity: (amount: number) => void

  updateCorruption: (amount: number) => void

  addArtifact: (artifact: Artifact) => void

  addFlag: (flag: string) => void

  resetCharacter: () => void
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  character: null,

  setCharacter: (character) =>
    set({
      character,
    }),

  updateSanity: (amount) =>
    set((state) => {
      if (!state.character) {
        return state
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
        return state
      }

      return {
        character: {
          ...state.character,

          corruption: Math.max(
            0,
            Math.min(100, state.character.corruption + amount),
          ),
        },
      }
    }),

  addArtifact: (artifact) =>
    set((state) => {
      if (!state.character) {
        return state
      }

      const alreadyExists = state.character.inventory.some(
        (item) => item.id === artifact.id,
      )

      if (alreadyExists) {
        return state
      }

      return {
        character: {
          ...state.character,

          inventory: [...state.character.inventory, artifact],
        },
      }
    }),

  addFlag: (flag) =>
    set((state) => {
      if (!state.character) {
        return state
      }

      if (state.character.flags.includes(flag)) {
        return state
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
}))
