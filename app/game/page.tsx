// app/game/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGameSession } from '@/hooks/useGameSession'
import { useSceneGenerator } from '@/hooks/useSceneGenerator'
import { isChoiceAvailable } from '@/lib/game/choiceUtils'
import { CharacterPanel } from '@/components/game/CharacterPanel'
import { SceneDisplay } from '@/components/game/SceneDisplay'
import { ChoiceList } from '@/components/game/ChoiceList'
import { LoadingOverlay } from '@/components/game/LoadingOverlay'
import { RotateCcw } from 'lucide-react'

export default function GamePage() {
  const router = useRouter()
  const {
    character,
    currentScene,
    applyChoiceEffects,
    setCurrentScene,
    pushHistory,
    reset,
    initializeGame,
  } = useGameSession()

  const { generateScene } = useSceneGenerator()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!character) {
      router.push('/editor')
    }
  }, [character, router])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const handleChoice = useCallback(
    async (choiceId: string) => {
      if (!currentScene || !character || isLoading) return
      const choice = currentScene.options.find((opt) => opt.id === choiceId)
      if (!choice) return
      if (!isChoiceAvailable(choice, character)) {
        alert('You cannot choose this option (requirements not met)')
        return
      }

      applyChoiceEffects(choice)

      setIsLoading(true)
      try {
        const newScene = await generateScene(currentScene, choice, character)
        setCurrentScene(newScene)
        pushHistory(newScene.id)
      } catch (error) {
        console.error('Failed to generate scene:', error)
        alert(
          'Failed to generate next scene. Using fallback. Please try again.',
        )
      } finally {
        setIsLoading(false)
      }
    },
    [
      currentScene,
      character,
      isLoading,
      applyChoiceEffects,
      generateScene,
      setCurrentScene,
      pushHistory,
    ],
  )

  const handleReset = useCallback(() => {
    reset()
  }, [reset])

  if (!character || !currentScene) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading your adventure...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <CharacterPanel character={character} />
        <SceneDisplay scene={currentScene} />
        <ChoiceList
          options={currentScene.options}
          character={character}
          onSelect={handleChoice}
          isLoading={isLoading}
        />
        <div className="mt-10 text-center">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset game</span>
          </button>
        </div>
      </div>
      <LoadingOverlay show={isLoading} />
    </main>
  )
}
