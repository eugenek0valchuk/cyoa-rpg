'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCharacterStore } from '@/lib/store/characterStore'
import { useGameStore } from '@/lib/store/gameStore'
import { scenes } from '@/lib/game/scenes'

export default function GamePage() {
  const router = useRouter()
  const character = useCharacterStore((state) => state.character)
  const updateStats = useCharacterStore((state) => state.updateStats)
  const addToInventory = useCharacterStore((state) => state.addToInventory)

  const [isLoading, setIsLoading] = useState(false)
  const { currentScene, setCurrentScene, pushHistory, resetGame } =
    useGameStore()

  useEffect(() => {
    if (!character) {
      router.push('/editor')
    }
  }, [character, router])

  useEffect(() => {
    if (character && !currentScene) {
      setCurrentScene(scenes.start)
      pushHistory('start')
    }
  }, [character, currentScene, setCurrentScene, pushHistory])

  const handleChoice = async (choiceId: string) => {
    if (!currentScene || !character || isLoading) return

    const choice = currentScene.options.find((opt) => opt.id === choiceId)
    if (!choice) return

    if (choice.requires && !choice.requires(character)) {
      alert('You cannot choose this option (requirements not met)')
      return
    }

    if (choice.effects) {
      updateStats(choice.effects)
    }

    setIsLoading(true)

    const fetchScene = async (attempt = 1): Promise<any> => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentScene,
            choice,
            character,
          }),
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (!data.scene) throw new Error('No scene in response')
        return data.scene
      } catch (error) {
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return fetchScene(attempt + 1)
        }
        throw error
      }
    }

    try {
      const newScene = await fetchScene()
      setCurrentScene(newScene)
      pushHistory(newScene.id)
    } catch (error) {
      console.error('Failed to generate scene after retries:', error)
      alert('Failed to generate next scene. Using fallback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    resetGame()
    setCurrentScene(scenes.start)
    pushHistory('start')
  }

  if (!character || !currentScene) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-400">Player:</span>
              <span className="font-bold ml-2">{character.name}</span>
              <span className="ml-4 text-blue-400">({character.class})</span>
            </div>
            <div className="flex gap-4 text-sm">
              <span>⚔️ {character.stats.strength}</span>
              <span>🏹 {character.stats.agility}</span>
              <span>📚 {character.stats.intelligence}</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Inventory: {character.inventory.join(', ') || 'empty'}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{currentScene.title}</h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {currentScene.description}
          </p>
        </div>

        <div className="space-y-3">
          {currentScene.options.map((option) => {
            const isAvailable = !option.requires || option.requires(character)
            return (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={!isAvailable || isLoading}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  isAvailable
                    ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-700'
                    : 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                {option.text}
                {!isAvailable && (
                  <span className="ml-2 text-xs text-gray-500">
                    (requires Int ≥5)
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">
                The storyteller weaves the next chapter...
              </p>
            </div>
          </div>
        )}
        <div className="mt-8 text-center">
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-300 underline"
          >
            Reset game
          </button>
        </div>
      </div>
    </main>
  )
}
