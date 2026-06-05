'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { useArtifactReveal } from '@/hooks/useArtifactReveal'
import { exitToMainMenu, useAutoSave } from '@/hooks/useAutoSave'

import { applyJournalDiscovery } from '@/lib/game/applyJournalDiscovery'
import { artifacts } from '@/lib/game/artifacts'
import { handleGameChoice } from '@/lib/game/handleChoice'
import {
  isChoiceAvailable,
  isChoiceAvailableAfterRiskSuccess,
} from '@/lib/game/choiceUtils'
import {
  applyRiskFailure,
  getRiskOffer,
  rollRiskCheck,
  type RiskOffer,
  type RiskRollResult,
} from '@/lib/game/riskCheck'
import { getKeyChoiceMeta } from '@/lib/game/keyChoices'
import { applyRaidModifierTick } from '@/lib/game/raidModifiers'
import { hasReturnSigil } from '@/lib/game/extraction'
import { isRaidEndingScene } from '@/lib/game/isRaidEndingScene'
import { getRaidModifier } from '@/lib/game/raidModifiers'
import { getRaidZone } from '@/lib/game/zones'
import {
  buildAbandonSummary,
  buildExtractSummary,
  buildFailSummary,
  applyContractToRaidEnd,
  completeRaidExtraction,
  failRaid,
  getExtractBlockReason,
  getRaidStartScene,
} from '@/lib/game/raid'
import { getActiveSlotId, saveCurrentGameState } from '@/lib/persistence/saveStorage'
import { MIN_EXTRACT_DEPTH } from '@/lib/types/hub'
import type { RaidSummary } from '@/lib/types/raidSummary'

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
  const setPendingSummary = useHubStore((state) => state.setPendingSummary)

  const currentScene = useGameStore((state) => state.currentScene)
  const setCurrentScene = useGameStore((state) => state.setCurrentScene)
  const pushHistory = useGameStore((state) => state.pushHistory)
  const pushSceneHistory = useGameStore((state) => state.pushSceneHistory)
  const sceneHistory = useGameStore((state) => state.sceneHistory)
  const resetGame = useGameStore((state) => state.resetGame)
  const setQueuedScene = useGameStore((state) => state.setQueuedScene)

  const { artifact, open, revealArtifact, closeArtifactReveal } =
    useArtifactReveal()

  useAutoSave()

  const [isLoading, setIsLoading] = useState(false)
  const [showChoices, setShowChoices] = useState(true)
  const [chronicleOpen, setChronicleOpen] = useState(false)
  const [showNewFlagHint, setShowNewFlagHint] = useState(false)
  const [showNewJournalHint, setShowNewJournalHint] = useState(false)
  const [statFlash, setStatFlash] = useState<{
    sanity?: number
    corruption?: number
  } | null>(null)
  const [diceRoll, setDiceRoll] = useState<{
    result: RiskRollResult
    offer: RiskOffer
    choiceIndex: number
  } | null>(null)
  const [pendingKeyChoice, setPendingKeyChoice] = useState<number | null>(null)

  const syncJournal = useCallback(
    (endingId?: string) => {
      const activeHub = useHubStore.getState().hub
      const activeCharacter = useCharacterStore.getState().character

      if (!activeHub || !activeCharacter || !currentScene) {
        return
      }

      const sceneIds = [
        ...sceneHistory.map((entry) => entry.id),
        currentScene.id,
      ]

      const { hub: nextHub, newEntries } = applyJournalDiscovery(activeHub, {
        flags: activeCharacter.flags,
        sceneIds,
        endingId,
      })

      if (newEntries.length > 0) {
        setHub(nextHub)
        setShowNewJournalHint(true)
      }
    },
    [currentScene, sceneHistory, setHub],
  )

  useEffect(() => {
    if (!character || !hub || !currentScene || !raid?.active) {
      return
    }

    syncJournal(isRaidEndingScene(currentScene) ? currentScene.id : undefined)
  }, [character, hub, currentScene, raid?.active, syncJournal])

  const isEndingScene = isRaidEndingScene(currentScene)
  const extractBlockReason = getExtractBlockReason(
    raid,
    character?.flags ?? [],
    currentScene?.id,
  )
  const extractAvailable = extractBlockReason === 'available'
  const hasSigil = hasReturnSigil(character?.flags ?? [])
  const raidDepth = sceneHistory.length
  const raidZone = getRaidZone(raidDepth, character?.corruption ?? 0)
  const raidModifier = getRaidModifier(raid?.modifierId)

  useEffect(() => {
    if (!character || !hub) {
      router.push('/')
      return
    }

    if (!raid?.active) {
      router.push('/hub')
      return
    }

    if (!currentScene) {
      setCurrentScene(
        getRaidStartScene(character, hub.journalEntries ?? []),
      )
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
      summary: RaidSummary,
    ) => {
      if (!nextCharacter || !nextHub) {
        return
      }

      setCharacter(nextCharacter)
      setHub(nextHub)
      setRaid(nextRaid)
      setPendingSummary(summary)
      resetGame()

      await saveCurrentGameState(getActiveSlotId(), {
        character: nextCharacter,
        currentScene: null,
        history: [],
        sceneHistory: [],
        hub: nextHub,
        raid: null,
      })

      router.push('/raid-summary')
    },
    [resetGame, router, setCharacter, setHub, setPendingSummary, setRaid],
  )

  const handleExtract = useCallback(async () => {
    if (!character || !hub || !raid || !extractAvailable || !currentScene) {
      return
    }

    const depth = sceneHistory.length
    const result = completeRaidExtraction(character, hub, raid, depth)
    const contractResolved = applyContractToRaidEnd(result.hub, raid, {
      outcome: 'extracted',
      depth,
      flags: character.flags,
      sanityAfter: result.character.sanity,
      extractSceneId: currentScene.id,
    })
    const summary = buildExtractSummary(
      character,
      hub,
      raid,
      result,
      depth,
      contractResolved.contractResult,
      contractResolved.hub,
    )

    await persistRaidReturn(
      result.character,
      contractResolved.hub,
      result.raid,
      summary,
    )
  }, [
    character,
    currentScene,
    extractAvailable,
    hub,
    persistRaidReturn,
    raid,
    sceneHistory.length,
  ])

  const handleReturnToHub = useCallback(async () => {
    if (!character || !hub || !raid) {
      return
    }

    const depth = sceneHistory.length
    const result = failRaid(character, hub, raid, depth)
    const contractResolved = applyContractToRaidEnd(result.hub, raid, {
      outcome: 'failed',
      depth,
      flags: character.flags,
      sanityAfter: result.character.sanity,
    })
    const summary = buildFailSummary(
      character,
      hub,
      raid,
      result,
      depth,
      contractResolved.contractResult,
      contractResolved.hub,
    )

    await persistRaidReturn(
      result.character,
      contractResolved.hub,
      result.raid,
      summary,
    )
  }, [character, hub, persistRaidReturn, raid, sceneHistory.length])

  const executeChoice = useCallback(
    async (
      choiceIndex: number,
      options?: { riskSuccess?: boolean },
    ) => {
      if (!currentScene || !character || !raid?.active) {
        setShowChoices(true)
        return
      }

      const choice = currentScene.options[choiceIndex]
      const journalEntries = hub?.journalEntries ?? []
      const available = options?.riskSuccess
        ? isChoiceAvailableAfterRiskSuccess(choice, character, journalEntries)
        : isChoiceAvailable(choice, character, journalEntries)

      if (!choice || !available) {
        setShowChoices(true)
        return
      }

      setIsLoading(true)
      setShowChoices(false)

      const flagsBefore = character.flags
      const sanityBefore = character.sanity
      const corruptionBefore = character.corruption

      try {
        await handleGameChoice({
          currentScene,
          choice,
          character,
          sceneHistory,
          artifacts,
          raidModifierId: raid?.modifierId,
          setCharacter,
          setCurrentScene,
          getQueuedScene: () => useGameStore.getState().queuedScene,
          setQueuedScene,
          pushSceneHistory,
          pushHistory,
          revealArtifact,
          journalEntries: hub?.journalEntries ?? [],
          roomMarks: hub?.roomMarks ?? [],
        })

        const flagsAfter =
          useCharacterStore.getState().character?.flags ?? flagsBefore
        const gainedFlag = flagsAfter.some((flag) => !flagsBefore.includes(flag))

        if (gainedFlag) {
          setShowNewFlagHint(true)
        }

        syncJournal()

        const afterCharacter = useCharacterStore.getState().character
        if (afterCharacter) {
          setStatFlash({
            sanity: afterCharacter.sanity - sanityBefore,
            corruption: afterCharacter.corruption - corruptionBefore,
          })
          window.setTimeout(() => setStatFlash(null), 2800)
        }

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
      hub,
      raid,
      sceneHistory,
      setCharacter,
      setCurrentScene,
      pushSceneHistory,
      pushHistory,
      revealArtifact,
      syncJournal,
    ],
  )

  const handleChoice = useCallback(
    async (choiceIndex: number) => {
      if (isLoading || diceRoll || pendingKeyChoice != null) {
        return
      }

      if (!currentScene || !character) {
        return
      }

      const choice = currentScene.options[choiceIndex]
      const journalEntries = hub?.journalEntries ?? []

      if (
        choice &&
        isChoiceAvailable(choice, character, journalEntries) &&
        getKeyChoiceMeta(currentScene.id, choice)
      ) {
        setPendingKeyChoice(choiceIndex)
        return
      }

      await executeChoice(choiceIndex)
    },
    [
      character,
      currentScene,
      diceRoll,
      executeChoice,
      hub?.journalEntries,
      isLoading,
      pendingKeyChoice,
    ],
  )

  const handleKeyChoiceConfirm = useCallback(async () => {
    if (pendingKeyChoice == null) {
      return
    }

    const choiceIndex = pendingKeyChoice
    setPendingKeyChoice(null)
    await executeChoice(choiceIndex)
  }, [executeChoice, pendingKeyChoice])

  const handleKeyChoiceCancel = useCallback(() => {
    setPendingKeyChoice(null)
  }, [])

  const handleRiskChoice = useCallback(
    (choiceIndex: number) => {
      if (!currentScene || !character || !raid?.active || isLoading || diceRoll) {
        return
      }

      const choice = currentScene.options[choiceIndex]
      const offer = choice
        ? getRiskOffer(choice, character, hub?.journalEntries ?? [])
        : null

      if (!offer) {
        return
      }

      const result = rollRiskCheck(offer.bonus, offer.dc)
      setShowChoices(false)
      setDiceRoll({ result, offer, choiceIndex })
    },
    [character, currentScene, diceRoll, hub?.journalEntries, isLoading, raid?.active],
  )

  const handleDiceComplete = useCallback(async () => {
    const activeRoll = diceRoll

    if (!activeRoll) {
      return
    }

    setDiceRoll(null)

    if (activeRoll.result.success) {
      await executeChoice(activeRoll.choiceIndex, { riskSuccess: true })
      return
    }

    if (!character) {
      setShowChoices(true)
      return
    }

    const sanityBefore = character.sanity
    const corruptionBefore = character.corruption
    let nextCharacter = applyRiskFailure(character)

    if (raid?.modifierId) {
      nextCharacter = applyRaidModifierTick(
        nextCharacter,
        raid.modifierId,
        hub?.roomMarks ?? [],
      )
    }

    setCharacter(nextCharacter)
    setStatFlash({
      sanity: nextCharacter.sanity - sanityBefore,
      corruption: nextCharacter.corruption - corruptionBefore,
    })
    window.setTimeout(() => setStatFlash(null), 2800)
    setShowChoices(true)
  }, [
    character,
    diceRoll,
    executeChoice,
    hub?.roomMarks,
    raid?.modifierId,
    setCharacter,
  ])

  const handleAbandonRaid = useCallback(async () => {
    if (!character || !hub || !raid) {
      return
    }

    const depth = sceneHistory.length
    const result = failRaid(character, hub, raid, depth)
    const contractResolved = applyContractToRaidEnd(result.hub, raid, {
      outcome: 'abandoned',
      depth,
      flags: character.flags,
      sanityAfter: result.character.sanity,
    })
    const summary = buildAbandonSummary(
      character,
      hub,
      raid,
      result,
      depth,
      contractResolved.contractResult,
      contractResolved.hub,
    )

    await persistRaidReturn(
      result.character,
      contractResolved.hub,
      result.raid,
      summary,
    )
  }, [character, hub, persistRaidReturn, raid, sceneHistory.length])

  const handleExitToMenu = useCallback(async () => {
    if (isEndingScene) {
      await handleReturnToHub()
      return
    }

    await exitToMainMenu()
    router.push('/')
  }, [handleReturnToHub, isEndingScene, router])

  const handleOpenChronicle = useCallback(() => {
    setChronicleOpen(true)
    setShowNewFlagHint(false)
    setShowNewJournalHint(false)
  }, [])

  const handleCloseChronicle = useCallback(() => {
    setChronicleOpen(false)
  }, [])

  return {
    character,
    hub,
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
    raidZone,
    raidModifier,
    minExtractDepth: MIN_EXTRACT_DEPTH,
    chronicleOpen,
    showNewFlagHint: showNewFlagHint || showNewJournalHint,
    journalCount: hub?.journalEntries.length ?? 0,
    flagCount: character?.flags.length ?? 0,
    handleOpenChronicle,
    handleCloseChronicle,
    handleChoice,
    handleRiskChoice,
    pendingKeyChoice,
    handleKeyChoiceConfirm,
    handleKeyChoiceCancel,
    diceRoll,
    handleDiceComplete,
    handleExtract,
    handleReturnToHub,
    handleAbandonRaid,
    handleExitToMenu,
    closeArtifactReveal,
    statFlash,
  }
}
