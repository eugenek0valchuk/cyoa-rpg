import { create } from 'zustand'

import type { Scene, SceneHistoryEntry } from '../types/game'

interface GameStore {
  currentScene: Scene | null

  sceneHistory: SceneHistoryEntry[]

  history: string[]

  setCurrentScene: (scene: Scene) => void

  pushSceneHistory: (scene: SceneHistoryEntry) => void

  pushHistory: (sceneId: string) => void

  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentScene: null,

  sceneHistory: [],

  history: [],

  setCurrentScene: (scene) =>
    set({
      currentScene: scene,
    }),

  pushSceneHistory: (scene) =>
    set((state) => ({
      sceneHistory: [...state.sceneHistory, scene],
    })),

  pushHistory: (sceneId) =>
    set((state) => ({
      history: [...state.history, sceneId],
    })),

  resetGame: () =>
    set({
      currentScene: null,

      sceneHistory: [],

      history: [],
    }),
}))
