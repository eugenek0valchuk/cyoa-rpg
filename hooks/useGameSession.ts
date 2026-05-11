import { useCallback } from 'react'
import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'
import { scenes } from '@/lib/game/scenes'
import { Choice, Scene } from '@/lib/types/game'

export function useGameSession() {
  const character = useCharacterStore((state) => state.character)
  const updateStats = useCharacterStore((state) => state.updateStats)
  const { currentScene, setCurrentScene, pushHistory, resetGame } =
    useGameStore()

  const applyChoiceEffects = useCallback(
    (choice: Choice) => {
      if (choice.effects) updateStats(choice.effects)
    },
    [updateStats],
  )

  const reset = useCallback(() => {
    resetGame()
    setCurrentScene(scenes.start)
    pushHistory('start')
  }, [resetGame, setCurrentScene, pushHistory])

  const initializeGame = useCallback(() => {
    if (character && !currentScene) {
      setCurrentScene(scenes.start)
      pushHistory('start')
    }
  }, [character, currentScene, setCurrentScene, pushHistory])

  return {
    character,
    currentScene,
    applyChoiceEffects,
    setCurrentScene,
    pushHistory,
    reset,
    initializeGame,
  }
}
