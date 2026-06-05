'use client'

import { useState } from 'react'

import {
  GameLayout,
  GameHeader,
  CharacterPanel,
  GameViewport,
  GameSceneView,
  ArtifactReveal,
} from '@/components/game'
import { GothicModal } from '@/components/ui/GothicModal'
import { useGameSession } from '@/hooks/useGameSession'
import { t } from '@/lib/i18n'

export default function GamePage() {
  const [abandonOpen, setAbandonOpen] = useState(false)

  const {
    character,
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
    handleChoice,
    handleExtract,
    handleAbandonRaid,
    handleExitToMenu,
    closeArtifactReveal,
  } = useGameSession()

  const { ui: hubText } = t.hub

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
        onExtract={handleExtract}
        onAbandon={() => setAbandonOpen(true)}
        onReset={handleExitToMenu}
      />

      <CharacterPanel character={character} />

      <div className="h-4" />

      <GameViewport loading={isLoading} blocked={artifactOpen}>
        <GameSceneView
          scene={currentScene}
          character={character}
          isLoading={isLoading}
          showChoices={showChoices}
          extractAvailable={extractAvailable && !isEndingScene}
          onExtract={handleExtract}
          onChoice={handleChoice}
        />
      </GameViewport>

      <ArtifactReveal
        artifact={artifact}
        open={artifactOpen}
        onClose={closeArtifactReveal}
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
