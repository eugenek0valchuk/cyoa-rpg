'use client'

import { useEffect, useRef } from 'react'

import {
  getActiveSlotId,
  saveCurrentGameState,
} from '@/lib/persistence/saveStorage'
import { createInitialHubState } from '@/lib/types/hub'
import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'
import { useHubStore } from '@/lib/store/hubStore'

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
        const { hub, raid } = useHubStore.getState()

        if (!character) {
          return
        }

        await saveCurrentGameState(getActiveSlotId(), {
          character,
          currentScene,
          history,
          sceneHistory,
          hub,
          raid,
        })
      }, SAVE_DEBOUNCE_MS)
    }

    const unsubscribeCharacter = useCharacterStore.subscribe(scheduleSave)
    const unsubscribeGame = useGameStore.subscribe(scheduleSave)
    const unsubscribeHub = useHubStore.subscribe(scheduleSave)

    return () => {
      unsubscribeCharacter()
      unsubscribeGame()
      unsubscribeHub()

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])
}

export async function restoreActiveSlot(slotId: number): Promise<{
  restored: boolean
  raidActive: boolean
}> {
  const { loadSaveSlot, setActiveSlotId } = await import(
    '@/lib/persistence/saveStorage'
  )

  const slot = await loadSaveSlot(slotId)

  if (!slot?.character) {
    return { restored: false, raidActive: false }
  }

  setActiveSlotId(slotId)

  useCharacterStore.getState().setCharacter(slot.character)

  if (slot.hub) {
    useHubStore.getState().setHub(slot.hub)
    useHubStore.getState().setRaid(slot.raid)
  } else {
    useHubStore.getState().initHubForCharacter(slot.character.inventory)
  }

  if (slot.currentScene) {
    const { cloneScene, getSceneById } = await import(
      '@/lib/game/sceneRegistry'
    )

    const restoreContext = {
      character: slot.character,
      journalEntries: slot.hub?.journalEntries ?? [],
      visitedSceneIds: new Set(slot.sceneHistory.map((entry) => entry.id)),
    }

    const freshScene =
      getSceneById(slot.currentScene.id, restoreContext) ??
      cloneScene(slot.currentScene)

    useGameStore.setState({
      currentScene: freshScene,
      history: slot.history,
      sceneHistory: slot.sceneHistory,
    })
  } else {
    useGameStore.getState().resetGame()
  }

  return {
    restored: true,
    raidActive: Boolean(slot.raid?.active),
  }
}

export async function flushCurrentSave(): Promise<boolean> {
  const character = useCharacterStore.getState().character
  const { currentScene, history, sceneHistory } = useGameStore.getState()
  const { hub, raid } = useHubStore.getState()

  if (!character || !hub) {
    return false
  }

  await saveCurrentGameState(getActiveSlotId(), {
    character,
    currentScene,
    history,
    sceneHistory,
    hub,
    raid,
  })

  return true
}

/** Drop in-memory session without touching IndexedDB. */
export function clearSessionMemory(): void {
  useCharacterStore.getState().resetCharacter()
  useHubStore.getState().resetHub()
  useGameStore.getState().resetGame()
}

/** Save progress, clear session memory, return to title screen. */
export async function exitToMainMenu(): Promise<void> {
  await flushCurrentSave()

  clearSessionMemory()
}

export async function clearActiveSlotSave(): Promise<void> {
  const { deleteSaveSlot, getActiveSlotId } = await import(
    '@/lib/persistence/saveStorage'
  )

  await deleteSaveSlot(getActiveSlotId())
}

export function initHubForNewCharacter(inventory: Parameters<
  typeof createInitialHubState
>[0]) {
  useHubStore.getState().initHubForCharacter(inventory ?? [])
}
