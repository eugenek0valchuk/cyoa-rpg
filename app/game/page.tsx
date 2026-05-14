'use client'

import {
  GameLayout,
  GameHeader,
  CharacterPanel,
  GameViewport,
  GameSceneView,
  ArtifactReveal,
} from '@/components/game'
import { useGameSession } from '@/hooks/useGameSession'

export default function GamePage() {
  const {
    character,
    currentScene,

    artifact,
    artifactOpen,

    isLoading,
    showChoices,

    handleChoice,
    handleReset,

    closeArtifactReveal,
  } = useGameSession()

  if (!character || !currentScene) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-[#d7c8bc]">
        <div className="animate-pulse text-sm uppercase tracking-[0.4em] text-[#75685f]">
          DESCENT AWAKENS
        </div>
      </main>
    )
  }

  return (
    <GameLayout>
      <GameHeader isLoading={isLoading} onReset={handleReset} />

      <CharacterPanel character={character} />

      <div className="h-6" />

      <GameViewport loading={isLoading} blocked={artifactOpen}>
        <GameSceneView
          scene={currentScene}
          character={character}
          isLoading={isLoading}
          showChoices={showChoices}
          onChoice={handleChoice}
        />
      </GameViewport>

      <ArtifactReveal
        artifact={artifact}
        open={artifactOpen}
        onClose={closeArtifactReveal}
      />
    </GameLayout>
  )
}
