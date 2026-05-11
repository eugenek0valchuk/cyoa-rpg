import { create } from 'zustand'
import { Scene } from '../types/game'

interface GameStore {
  currentScene: Scene | null
  history: string[]
  setCurrentScene: (scene: Scene) => void
  pushHistory: (sceneId: string) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentScene: null,
  history: [],
  setCurrentScene: (scene) => set({ currentScene: scene }),
  pushHistory: (sceneId) =>
    set((state) => ({ history: [...state.history, sceneId] })),
  resetGame: () => set({ currentScene: null, history: [] }),
}))
