import { create } from 'zustand'

import type { Scene, SceneHistoryEntry } from '@/lib/types/game'

interface GameStore {
  currentScene: Scene | null
  queuedScene: Scene | null
  history: string[]
  sceneHistory: SceneHistoryEntry[]
  setCurrentScene: (scene: Scene) => void
  setQueuedScene: (scene: Scene | null) => void
  pushHistory: (sceneId: string) => void
  pushSceneHistory: (scene: SceneHistoryEntry) => void
  rewindSceneHistoryTo: (index: number) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  currentScene: null,
  queuedScene: null,
  history: [],
  sceneHistory: [],

  setCurrentScene: (scene) =>
    set({
      currentScene: scene,
    }),

  setQueuedScene: (scene) =>
    set({
      queuedScene: scene,
    }),

  pushHistory: (sceneId) =>
    set((state) => ({
      history: [...state.history, sceneId],
    })),

  pushSceneHistory: (scene) =>
    set((state) => ({
      sceneHistory: [...state.sceneHistory, scene].slice(-12),
    })),

  rewindSceneHistoryTo: (index) =>
    set((state) => ({
      sceneHistory: state.sceneHistory.slice(0, index),
      history: state.history.slice(0, index + 1),
    })),

  resetGame: () =>
    set({
      currentScene: null,
      queuedScene: null,
      history: [],
      sceneHistory: [],
    }),
}))
