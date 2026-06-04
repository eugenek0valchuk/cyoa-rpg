'use client'

import { useEffect, useRef } from 'react'

import {
  getActiveSlotId,
  saveCurrentGameState,
} from '@/lib/persistence/saveStorage'
import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'

const SAVE_DEBOUNCE_MS = 800

export function useAutoSave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const scheduleSave = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(async () => {
        const character = useCharacterStore.getState().character
        const { currentScene, history, sceneHistory } = useGameStore.getState()

        if (!character || !currentScene) {
          return
        }

        await saveCurrentGameState(getActiveSlotId(), {
          character,
          currentScene,
          history,
          sceneHistory,
        })
      }, SAVE_DEBOUNCE_MS)
    }

    const unsubscribeCharacter = useCharacterStore.subscribe(scheduleSave)
    const unsubscribeGame = useGameStore.subscribe(scheduleSave)

    return () => {
      unsubscribeCharacter()
      unsubscribeGame()

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])
}

export async function restoreActiveSlot(slotId: number): Promise<boolean> {
  const { loadSaveSlot, setActiveSlotId } = await import(
    '@/lib/persistence/saveStorage'
  )

  const slot = await loadSaveSlot(slotId)

  if (!slot?.character || !slot.currentScene) {
    return false
  }

  setActiveSlotId(slotId)

  useCharacterStore.getState().setCharacter(slot.character)
  useGameStore.setState({
    currentScene: slot.currentScene,
    history: slot.history,
    sceneHistory: slot.sceneHistory,
  })

  return true
}

export async function clearActiveSlotSave(): Promise<void> {
  const { deleteSaveSlot, getActiveSlotId } = await import(
    '@/lib/persistence/saveStorage'
  )

  await deleteSaveSlot(getActiveSlotId())
}
