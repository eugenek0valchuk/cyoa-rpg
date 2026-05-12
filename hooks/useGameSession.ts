'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { useArtifactReveal } from '@/hooks/useArtifactReveal'
import { useSceneGenerator } from '@/hooks/useSceneGenerator'

import { artifacts } from '@/lib/game/artifacts'
import { getInitialScene } from '@/lib/game/getInitialScene'
import { handleGameChoice } from '@/lib/game/handleChoice'
import { isChoiceAvailable } from '@/lib/game/choiceUtils'

import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'

export function useGameSession() {
  const router = useRouter()

  const character = useCharacterStore((state) => state.character)

  const updateSanity = useCharacterStore((state) => state.updateSanity)

  const updateCorruption = useCharacterStore((state) => state.updateCorruption)

  const addArtifact = useCharacterStore((state) => state.addArtifact)

  const addFlag = useCharacterStore((state) => state.addFlag)

  const resetCharacter = useCharacterStore((state) => state.resetCharacter)

  const currentScene = useGameStore((state) => state.currentScene)

  const setCurrentScene = useGameStore((state) => state.setCurrentScene)

  const pushHistory = useGameStore((state) => state.pushHistory)

  const pushSceneHistory = useGameStore((state) => state.pushSceneHistory)

  const sceneHistory = useGameStore((state) => state.sceneHistory)

  const resetGame = useGameStore((state) => state.resetGame)

  const { generateScene } = useSceneGenerator()

  const { artifact, open, revealArtifact, closeArtifactReveal } =
    useArtifactReveal()

  const [isLoading, setIsLoading] = useState(false)

  const [showChoices, setShowChoices] = useState(true)

  useEffect(() => {
    if (!character) {
      router.push('/editor')
    }
  }, [character, router])

  useEffect(() => {
    if (!currentScene) {
      setCurrentScene(getInitialScene())
    }
  }, [currentScene, setCurrentScene])

  const handleChoice = useCallback(
    async (choiceId: string) => {
      if (!currentScene || !character || isLoading) {
        return
      }

      const choice = currentScene.options.find(
        (option) => option.id === choiceId,
      )

      if (!choice) {
        return
      }

      if (!isChoiceAvailable(choice, character)) {
        return
      }

      setIsLoading(true)

      setShowChoices(false)

      try {
        await handleGameChoice({
          currentScene,
          choice,
          character,
          sceneHistory,

          artifacts,
          generateScene,

          updateSanity,
          updateCorruption,
          addFlag,
          addArtifact,

          setCurrentScene,
          pushSceneHistory,
          pushHistory,

          revealArtifact,
        })

        await new Promise((resolve) => setTimeout(resolve, 350))

        setShowChoices(true)
      } catch (error) {
        console.error('Choice handling failed:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      currentScene,
      character,
      isLoading,
      sceneHistory,
      generateScene,
      updateSanity,
      updateCorruption,
      addFlag,
      addArtifact,
      setCurrentScene,
      pushSceneHistory,
      pushHistory,
      revealArtifact,
    ],
  )

  const handleReset = useCallback(() => {
    resetCharacter()

    resetGame()

    router.push('/editor')
  }, [resetCharacter, resetGame, router])

  return {
    character,
    currentScene,

    artifact,
    artifactOpen: open,

    isLoading,
    showChoices,

    handleChoice,
    handleReset,

    closeArtifactReveal,
  }
}
