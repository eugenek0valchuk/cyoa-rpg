import { create } from 'zustand'

import type { Scene, SceneHistoryEntry } from '@/lib/types/game'

interface GameStore {
  currentScene: Scene | null
  history: string[]
  sceneHistory: SceneHistoryEntry[]
  setCurrentScene: (scene: Scene) => void
  pushHistory: (sceneId: string) => void
  pushSceneHistory: (scene: SceneHistoryEntry) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentScene: null,
  history: [],
  sceneHistory: [],

  setCurrentScene: (scene) =>
    set({
      currentScene: scene,
    }),

  pushHistory: (sceneId) =>
    set((state) => ({
      history: [...state.history, sceneId],
    })),

  pushSceneHistory: (scene) =>
    set((state) => ({
      sceneHistory: [...state.sceneHistory, scene].slice(-12),
    })),

  resetGame: () =>
    set({
      currentScene: null,
      history: [],
      sceneHistory: [],
    }),
}))
