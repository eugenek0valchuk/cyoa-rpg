'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'

import { artifacts } from '@/lib/game/artifacts'
import { isChoiceVisible } from '@/lib/game/choiceVisibility'
import { computeSanityAfterChoice } from '@/lib/game/sanityPacing'

import {
  GameLayout,
  GameHeader,
  CharacterPanel,
  GameViewport,
  GameSceneView,
  ArtifactReveal,
  RaidChronicleModal,
  RaidTipBanner,
  StatChangeFlash,
} from '@/components/game'
import { DiceRollOverlay } from '@/components/game/scene/DiceRollOverlay'
import { NpcEncounterModal } from '@/components/game/scene/NpcEncounterModal'
import { KeyChoiceConfirm } from '@/components/game/scene/KeyChoiceConfirm'
import { RaidPrologueModal } from '@/components/game/scene/RaidPrologueModal'
import { buildPrologueSlides } from '@/lib/game/prologue'
import { isNpcEncounterScene, getNpcMeetingFlag } from '@/lib/game/npcEncounter'
import { getKeyChoiceMeta } from '@/lib/game/keyChoices'
import { GothicModal } from '@/components/ui/GothicModal'
import { useGameSession } from '@/hooks/useGameSession'
import { useAmbientAudio } from '@/hooks/useAmbientAudio'
import { resolveAmbientTense } from '@/lib/audio/AmbientController'
import { useHubStore } from '@/lib/store/hubStore'
import { useGameStore } from '@/lib/store/gameStore'
import { useCharacterStore } from '@/lib/store/characterStore'
import { t } from '@/lib/i18n'

export default function GamePage() {
  const [abandonOpen, setAbandonOpen] = useState(false)
  const [npcEncounterOpen, setNpcEncounterOpen] = useState(false)
  const raid = useHubStore((state) => state.raid)
  const setRaid = useHubStore((state) => state.setRaid)
  const sceneHistory = useGameStore((state) => state.sceneHistory)
  const setCharacter = useCharacterStore((state) => state.setCharacter)

  const {
    character,
    hub,
    currentScene,
    artifact,
    artifactOpen,
    isLoading,
    showChoices,
    isEndingScene,
    extractAvailable,
    extractBlockReason,
    hasSigil,
    raidDepth,
    raidZone,
    raidModifier,
    minExtractDepth,
    chronicleOpen,
    showNewFlagHint,
    flagCount,
    journalCount,
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
    handleAbandonRaid,
    handleExitToMenu,
    closeArtifactReveal,
    statFlash,
  } = useGameSession()

  const { ui: hubText } = t.hub

  const prologueSlides = useMemo(() => {
    if (!raid?.active) {
      return []
    }

    return buildPrologueSlides({
      modifierId: raid.modifierId ?? null,
    })
  }, [raid?.active, raid?.modifierId])

  const showPrologue =
    prologueSlides.length > 0 &&
    !raid?.prologueSeen &&
    sceneHistory.length === 0 &&
    !isEndingScene

  const isNpcScene =
    currentScene != null && isNpcEncounterScene(currentScene.id)

  useEffect(() => {
    setNpcEncounterOpen(isNpcScene)
  }, [isNpcScene, currentScene?.id])

  const handleNpcDialogueComplete = useCallback(() => {
    const active = useCharacterStore.getState().character
    const flag = currentScene ? getNpcMeetingFlag(currentScene.id) : null

    if (!active || !flag || active.flags.includes(flag)) {
      return
    }

    setCharacter({
      ...active,
      flags: [...active.flags, flag],
    })
  }, [currentScene, setCharacter])

  const handleNpcChoice = useCallback(
    (choiceIndex: number) => {
      handleChoice(choiceIndex)
    },
    [handleChoice],
  )

  const handleNpcRiskChoice = useCallback(
    (choiceIndex: number) => {
      handleRiskChoice(choiceIndex)
    },
    [handleRiskChoice],
  )

  const handlePrologueComplete = () => {
    if (!raid) {
      return
    }

    setRaid({ ...raid, prologueSeen: true })
  }

  const pendingKeyChoiceData = useMemo(() => {
    if (!currentScene || pendingKeyChoice == null) {
      return null
    }

    const choice = currentScene.options[pendingKeyChoice]
    if (!choice) {
      return null
    }

    return {
      choice,
      meta: getKeyChoiceMeta(currentScene.id, choice),
    }
  }, [currentScene, pendingKeyChoice])

  const sanityStress = useMemo(() => {
    if (!character || !currentScene || isEndingScene) {
      return false
    }

    if (character.sanity <= 15) {
      return true
    }

    return currentScene.options.some((option) => {
      if (!isChoiceVisible(option, character, hub?.journalEntries ?? [])) {
        return false
      }

      return (
        computeSanityAfterChoice(
          character,
          option,
          artifacts,
          raidModifier?.id,
          hub?.roomMarks ?? [],
        ) <= 15
      )
    })
  }, [
    character,
    currentScene,
    hub?.journalEntries,
    hub?.roomMarks,
    isEndingScene,
    raidModifier?.id,
  ])

  useAmbientAudio({
    mode: 'descent',
    enabled: !!character && !!currentScene && raid?.active === true,
    tense: resolveAmbientTense({
      sanity: character?.sanity,
      sanityStress,
      npcOpen: npcEncounterOpen && isNpcScene,
      keyChoicePending: pendingKeyChoice != null,
      diceRolling: diceRoll != null,
      ending: isEndingScene,
      modalOpen: abandonOpen || chronicleOpen || showPrologue,
    }),
  })

  if (!character || !currentScene) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-[#d7c8bc]">
        <div className="animate-pulse text-sm uppercase tracking-[0.4em] text-[#75685f]">
          {t.ui.game.loading}
        </div>
      </main>
    )
  }

  const confirmAbandon = async () => {
    setAbandonOpen(false)
    await handleAbandonRaid()
  }

  return (
    <GameLayout>
      <div className="shrink-0">
        <GameHeader
          isLoading={isLoading}
          extractAvailable={extractAvailable}
          extractBlockReason={extractBlockReason}
          hasSigil={hasSigil}
          raidDepth={raidDepth}
          minExtractDepth={minExtractDepth}
          raidZone={raidZone}
          raidModifier={raidModifier}
          isEndingScene={isEndingScene}
          flagCount={flagCount}
          journalCount={journalCount}
          showNewFlagHint={showNewFlagHint}
          onOpenChronicle={handleOpenChronicle}
          onExtract={handleExtract}
          onAbandon={() => setAbandonOpen(true)}
          onReset={handleExitToMenu}
        />
      </div>

      <div className="shrink-0">
        <CharacterPanel character={character} sanityStress={sanityStress} />
      </div>

      <GameViewport loading={isLoading} blocked={artifactOpen}>
        <div className="shrink-0">
          <RaidTipBanner
            raidDepth={raidDepth}
            isEndingScene={isEndingScene}
          />
        </div>
        <StatChangeFlash flash={statFlash} />
        <GameSceneView
          scene={currentScene}
          character={character}
          journalEntries={hub?.journalEntries ?? []}
          raidModifierId={raidModifier?.id}
          roomMarks={hub?.roomMarks ?? []}
          isLoading={isLoading}
          showChoices={showChoices && !showPrologue && !npcEncounterOpen}
          extractAvailable={extractAvailable && !isEndingScene}
          onExtract={handleExtract}
          onChoice={handleChoice}
          onRiskChoice={handleRiskChoice}
          onReturnToChamber={handleExitToMenu}
          hideSceneBody={npcEncounterOpen && isNpcScene}
        />
      </GameViewport>

      <RaidPrologueModal
        open={showPrologue}
        slides={prologueSlides}
        onComplete={handlePrologueComplete}
      />

      {diceRoll && (
        <DiceRollOverlay
          open
          result={diceRoll.result}
          stat={diceRoll.offer.stat}
          bonus={diceRoll.offer.bonus}
          onComplete={handleDiceComplete}
        />
      )}

      <NpcEncounterModal
        open={
          npcEncounterOpen && isNpcScene && !showPrologue && !artifactOpen
        }
        scene={currentScene}
        character={character}
        journalEntries={hub?.journalEntries ?? []}
        visitedSceneIds={new Set(sceneHistory.map((entry) => entry.id))}
        raidModifierId={raidModifier?.id}
        roomMarks={hub?.roomMarks ?? []}
        isLoading={isLoading}
        pendingKeyChoice={pendingKeyChoice}
        onDialogueComplete={handleNpcDialogueComplete}
        onChoice={handleNpcChoice}
        onRiskChoice={handleNpcRiskChoice}
      />

      <KeyChoiceConfirm
        open={pendingKeyChoiceData?.meta != null}
        choice={pendingKeyChoiceData?.choice ?? null}
        meta={pendingKeyChoiceData?.meta ?? null}
        character={character}
        raidModifierId={raidModifier?.id}
        roomMarks={hub?.roomMarks ?? []}
        onConfirm={handleKeyChoiceConfirm}
        onCancel={handleKeyChoiceCancel}
      />

      <ArtifactReveal
        artifact={artifact}
        open={artifactOpen}
        onClose={closeArtifactReveal}
      />

      <RaidChronicleModal
        open={chronicleOpen}
        onClose={handleCloseChronicle}
        flags={character.flags}
        journalEntries={hub?.journalEntries ?? []}
        raidDepth={raidDepth}
      />

      <GothicModal
        open={abandonOpen}
        onClose={() => setAbandonOpen(false)}
        icon="corruption"
        title={hubText.abandonConfirmTitle}
        subtitle={hubText.abandonConfirmBody}
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setAbandonOpen(false)}
              className="border border-[#2b2320] px-6 py-2 text-[11px] uppercase tracking-[0.15em] text-[#85776a] transition hover:border-[#5c1f1f] hover:text-[#d8c9be]"
            >
              {hubText.abandonCancel}
            </button>
            <button
              type="button"
              onClick={confirmAbandon}
              disabled={isLoading}
              className="font-cinzel border-2 border-[#5c1f1f] bg-[#160909] px-6 py-2 text-[11px] uppercase tracking-[0.15em] text-[#d46060] transition hover:bg-[#220d0d] disabled:opacity-40"
            >
              {hubText.abandonConfirm}
            </button>
          </div>
        }
      >
        <p className="text-[14px] leading-relaxed text-[#9d8d82]">
          {hubText.abandonHint}
        </p>
      </GothicModal>
    </GameLayout>
  )
}
