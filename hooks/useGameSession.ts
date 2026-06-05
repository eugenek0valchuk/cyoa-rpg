'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { useArtifactReveal } from '@/hooks/useArtifactReveal'
import { clearActiveSlotSave, useAutoSave } from '@/hooks/useAutoSave'

import { artifacts } from '@/lib/game/artifacts'
import { handleGameChoice } from '@/lib/game/handleChoice'
import { isChoiceAvailable } from '@/lib/game/choiceUtils'
import { hasReturnSigil } from '@/lib/game/extraction'
import {
  completeRaidExtraction,
  failRaid,
  getExtractBlockReason,
  getRaidStartScene,
} from '@/lib/game/raid'
import { getActiveSlotId, saveCurrentGameState } from '@/lib/persistence/saveStorage'
import { MIN_EXTRACT_DEPTH } from '@/lib/types/hub'

import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'
import { useHubStore } from '@/lib/store/hubStore'

export function useGameSession() {
  const router = useRouter()

  const character = useCharacterStore((state) => state.character)
  const setCharacter = useCharacterStore((state) => state.setCharacter)

  const hub = useHubStore((state) => state.hub)
  const raid = useHubStore((state) => state.raid)
  const setHub = useHubStore((state) => state.setHub)
  const setRaid = useHubStore((state) => state.setRaid)
  const resetHub = useHubStore((state) => state.resetHub)

  const currentScene = useGameStore((state) => state.currentScene)
  const setCurrentScene = useGameStore((state) => state.setCurrentScene)
  const pushHistory = useGameStore((state) => state.pushHistory)
  const pushSceneHistory = useGameStore((state) => state.pushSceneHistory)
  const sceneHistory = useGameStore((state) => state.sceneHistory)
  const resetGame = useGameStore((state) => state.resetGame)

  const { artifact, open, revealArtifact, closeArtifactReveal } =
    useArtifactReveal()

  useAutoSave()

  const [isLoading, setIsLoading] = useState(false)
  const [showChoices, setShowChoices] = useState(true)

  const isEndingScene = currentScene?.options.length === 0
  const extractBlockReason = getExtractBlockReason(
    raid,
    character?.flags ?? [],
    currentScene?.id,
  )
  const extractAvailable = extractBlockReason === 'available'
  const hasSigil = hasReturnSigil(character?.flags ?? [])
  const raidDepth = sceneHistory.length

  useEffect(() => {
    if (!character || !hub) {
      router.push('/editor')
      return
    }

    if (!raid?.active) {
      router.push('/hub')
      return
    }

    if (!currentScene) {
      setCurrentScene(getRaidStartScene())
    }
  }, [character, hub, raid, currentScene, router, setCurrentScene])

  useEffect(() => {
    const state = useHubStore.getState()

    if (!state.raid?.active) {
      return
    }

    if (state.raid.depth === sceneHistory.length) {
      return
    }

    useHubStore.getState().setRaid({
      ...state.raid,
      depth: sceneHistory.length,
    })
  }, [sceneHistory.length])

  const persistRaidReturn = useCallback(
    async (
      nextCharacter: typeof character,
      nextHub: typeof hub,
      nextRaid: null,
    ) => {
      if (!nextCharacter || !nextHub) {
        return
      }

      setCharacter(nextCharacter)
      setHub(nextHub)
      setRaid(nextRaid)
      resetGame()

      await saveCurrentGameState(getActiveSlotId(), {
        character: nextCharacter,
        currentScene: null,
        history: [],
        sceneHistory: [],
        hub: nextHub,
        raid: null,
      })

      router.push('/hub')
    },
    [resetGame, router, setCharacter, setHub, setRaid],
  )

  const handleExtract = useCallback(async () => {
    if (!character || !hub || !raid || !extractAvailable) {
      return
    }

    const result = completeRaidExtraction(
      character,
      hub,
      raid,
      sceneHistory.length,
    )

    await persistRaidReturn(result.character, result.hub, result.raid)
  }, [character, extractAvailable, hub, persistRaidReturn, raid, sceneHistory.length])

  const handleReturnToHub = useCallback(async () => {
    if (!character || !hub || !raid) {
      return
    }

    const result = failRaid(character, hub, raid, sceneHistory.length)
    await persistRaidReturn(result.character, result.hub, result.raid)
  }, [character, hub, persistRaidReturn, raid, sceneHistory.length])

  const handleChoice = useCallback(
    async (choiceId: string) => {
      if (!currentScene || !character || !raid?.active || isLoading) {
        return
      }

      const choice = currentScene.options.find(
        (option) => option.id === choiceId,
      )

      if (!choice || !isChoiceAvailable(choice, character)) {
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
          setCharacter,
          setCurrentScene,
          pushSceneHistory,
          pushHistory,
          revealArtifact,
        })

        await new Promise((resolve) => setTimeout(resolve, 350))
        setShowChoices(true)
      } catch (error) {
        console.error('Choice handling failed:', error)
        setShowChoices(true)
      } finally {
        setIsLoading(false)
      }
    },
    [
      currentScene,
      character,
      raid,
      isLoading,
      sceneHistory,
      setCharacter,
      setCurrentScene,
      pushSceneHistory,
      pushHistory,
      revealArtifact,
    ],
  )

  const handleReset = useCallback(async () => {
    if (isEndingScene) {
      await handleReturnToHub()
      return
    }

    await clearActiveSlotSave()
    resetHub()
    resetGame()
    router.push('/archives')
  }, [handleReturnToHub, isEndingScene, resetGame, resetHub, router])

  return {
    character,
    currentScene,
    artifact,
    artifactOpen: open,
    isLoading,
    showChoices,
    isEndingScene,
    extractAvailable,
    extractBlockReason,
    hasSigil,
    raidDepth,
    minExtractDepth: MIN_EXTRACT_DEPTH,
    handleChoice,
    handleExtract,
    handleReturnToHub,
    handleReset,
    closeArtifactReveal,
  }
}
