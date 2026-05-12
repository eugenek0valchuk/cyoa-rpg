'use client'

import { useEffect, useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { RotateCcw } from 'lucide-react'

import { useCharacterStore } from '@/lib/store/characterStore'

import { useGameStore } from '@/lib/store/gameStore'

import { scenes } from '@/lib/game/scenes'

import { isChoiceAvailable } from '@/lib/game/choiceUtils'

import { CharacterPanel } from '@/components/game/CharacterPanel'

import { SceneChronicle } from '@/components/game/SceneChronicle'

import { ChoiceList } from '@/components/game/ChoiceList'

import { LoadingOverlay } from '@/components/game/LoadingOverlay'

export default function GamePage() {
  const router = useRouter()

  const character = useCharacterStore((s) => s.character)

  const updateSanity = useCharacterStore((s) => s.updateSanity)

  const updateCorruption = useCharacterStore((s) => s.updateCorruption)

  const addToInventory = useCharacterStore((s) => s.addToInventory)

  const addFlag = useCharacterStore((s) => s.addFlag)

  const resetCharacter = useCharacterStore((s) => s.resetCharacter)

  const currentScene = useGameStore((s) => s.currentScene)

  const setCurrentScene = useGameStore((s) => s.setCurrentScene)

  const pushHistory = useGameStore((s) => s.pushHistory)

  const pushSceneHistory = useGameStore((s) => s.pushSceneHistory)

  const resetGame = useGameStore((s) => s.resetGame)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!character) {
      router.push('/editor')
    }
  }, [character, router])

  useEffect(() => {
    if (!currentScene) {
      setCurrentScene(scenes.start)
    }
  }, [currentScene, setCurrentScene])

  const handleChoice = useCallback(
    async (choiceId: string) => {
      if (!currentScene || !character || isLoading) {
        return
      }

      const choice = currentScene.options.find((opt) => opt.id === choiceId)

      if (!choice) {
        return
      }

      if (!isChoiceAvailable(choice, character)) {
        return
      }

      pushSceneHistory({
        id: currentScene.id,

        title: currentScene.title,

        description: currentScene.description,
      })

      if (choice.effects?.sanity) {
        updateSanity(choice.effects.sanity)
      }

      if (choice.effects?.corruption) {
        updateCorruption(choice.effects.corruption)
      }

      if (choice.effects?.addItem) {
        addToInventory(choice.effects.addItem)
      }

      if (choice.effects?.addFlag) {
        addFlag(choice.effects.addFlag)
      }

      setIsLoading(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 900))

        const nextScene = scenes[choice.id]

        if (nextScene) {
          setCurrentScene(nextScene)

          pushHistory(nextScene.id)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      currentScene,
      character,
      isLoading,
      updateSanity,
      updateCorruption,
      addToInventory,
      addFlag,
      setCurrentScene,
      pushHistory,
      pushSceneHistory,
    ],
  )

  const handleReset = useCallback(() => {
    resetCharacter()

    resetGame()

    router.push('/editor')
  }, [resetCharacter, resetGame, router])

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
    <main className="relative min-h-screen overflow-hidden bg-black px-4 text-[#e7ded7]">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.95)]" />

      <section className="relative z-10 mx-auto max-w-[920px] pt-[18vh] pb-24">
        <div className="mb-10 text-center">
          <div className="text-[10px] uppercase tracking-[0.7em] text-[#6d5e55]">
            THE CHRONICLE CONTINUES
          </div>

          <div className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-[#7a2222] to-transparent" />
        </div>
        <CharacterPanel character={character} />

        <div className="h-6" />

        <SceneChronicle scene={currentScene} />

        <div className="h-8" />

        <ChoiceList
          options={currentScene.options}
          character={character}
          onSelect={handleChoice}
          isLoading={isLoading}
        />

        <div className="mt-14 flex justify-center">
          <button
            onClick={handleReset}
            className="
              group
              inline-flex
              items-center
              gap-3

              border
              border-[#2b2320]

              bg-[#100b0b]/90

              px-5
              py-3

              text-[11px]
              uppercase
              tracking-[0.35em]

              text-[#75685f]

              transition-all
              duration-300

              hover:border-[#4a2323]
              hover:text-[#d0c2b6]
              hover:bg-[#161010]
            "
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />

            <span>Return To Descent</span>
          </button>
        </div>
      </section>

      <LoadingOverlay show={isLoading} />
    </main>
  )
}
