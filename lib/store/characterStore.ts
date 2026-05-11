import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Character, Stats } from '../types/game'

interface CharacterStore {
  character: Character | null
  setCharacter: (char: Character) => void
  updateStats: (stats: Partial<Stats>) => void
  addToInventory: (item: string) => void
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      character: null,
      setCharacter: (char) => set({ character: char }),
      updateStats: (stats) =>
        set((state) => ({
          character: state.character
            ? {
                ...state.character,
                stats: { ...state.character.stats, ...stats },
              }
            : null,
        })),
      addToInventory: (item) =>
        set((state) => ({
          character: state.character
            ? {
                ...state.character,
                inventory: [...state.character.inventory, item],
              }
            : null,
        })),
    }),
    { name: 'character-storage' },
  ),
)
