'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

import { ChoiceList } from '@/components/game/scene/ChoiceList'
import { GameIcon } from '@/components/game/ui/GameIcon'
import { buildNpcEncounterDialogue } from '@/lib/game/npcEncounter'
import { zLayers } from '@/lib/ui/layers'
import { npcEncounterUi } from '@/locales/ru/npcEncounters'
import type { RaidModifierId } from '@/lib/game/raidModifiers'
import type { Character, Scene } from '@/lib/types/game'

interface NpcEncounterModalProps {
  open: boolean
  scene: Scene
  character: Character
  journalEntries: string[]
  visitedSceneIds: Set<string>
  raidModifierId?: RaidModifierId | null
  roomMarks?: string[]
  isLoading: boolean
  pendingKeyChoice?: number | null
  onChoice: (choiceIndex: number) => void
  onRiskChoice?: (choiceIndex: number) => void
}

function renderEmphasis(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-[#e7ded7]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export function NpcEncounterModal({
  open,
  scene,
  character,
  journalEntries,
  visitedSceneIds,
  raidModifierId,
  roomMarks = [],
  isLoading,
  pendingKeyChoice = null,
  onChoice,
  onRiskChoice,
}: NpcEncounterModalProps) {
  const encounter = useMemo(
    () =>
      buildNpcEncounterDialogue(scene.id, journalEntries, visitedSceneIds),
    [scene.id, journalEntries, visitedSceneIds],
  )

  const def = encounter.def
  const lines = encounter.lines

  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<'dialogue' | 'choices'>('dialogue')

  useEffect(() => {
    setStep(0)
    setPhase('dialogue')
  }, [scene.id])

  useEffect(() => {
    if (!open) {
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const advanceDialogue = useCallback(() => {
    setStep((current) => {
      if (current >= lines.length - 1) {
        setPhase('choices')
        return current
      }

      return current + 1
    })
  }, [lines.length])

  const skipToChoices = useCallback(() => {
    setPhase('choices')
  }, [])

  useEffect(() => {
    if (!open || phase !== 'dialogue') {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        advanceDialogue()
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        skipToChoices()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, phase, advanceDialogue, skipToChoices])

  const choicesLocked = isLoading || pendingKeyChoice != null

  if (!open || !def || typeof document === 'undefined') {
    return null
  }

  const isLastLine = step >= lines.length - 1

  return createPortal(
    <div
      className={`fixed inset-0 ${zLayers.npcEncounter} flex items-center justify-center p-2 sm:p-5`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="npc-encounter-title"
    >
      <div className="absolute inset-0 bg-black/86 backdrop-blur-[2px]" />

      <div className="relative z-10 flex h-[min(92vh,760px)] w-full max-w-6xl flex-col overflow-hidden border-2 border-[#4a3030] bg-[#0a0707] shadow-[0_0_80px_rgba(92,31,31,0.35)] lg:flex-row">
        <div className="relative min-h-[200px] w-full shrink-0 lg:min-h-0 lg:w-[42%]">
          <Image
            src={def.imageSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 42vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/45 to-[#0a0707] lg:to-[#0a0707]/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0707] via-transparent to-black/35" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex items-end gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#6a5020]/70 bg-[#120e08]/80 sm:h-16 sm:w-16">
                <GameIcon type={def.icon} size={32} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a08040]">
                  {def.npcTitle}
                </p>
                <h2
                  id="npc-encounter-title"
                  className="font-cinzel text-lg uppercase tracking-[0.08em] text-[#efe5dc] sm:text-xl"
                >
                  {def.npcName}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col border-t border-[#2b2320] lg:border-l lg:border-t-0">
          <div className="shrink-0 border-b border-[#241919] bg-[#120d0d] px-4 py-3 sm:px-5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#75685f]">
              {scene.title}
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto chronicle-scrollbar px-4 py-4 sm:px-5">
            {phase === 'dialogue' ? (
              <blockquote className="border-l-2 border-[#8e1f1f]/70 pl-4 text-[15px] leading-relaxed text-[#cfc2b8] sm:text-[16px]">
                «{renderEmphasis(lines[step] ?? '')}»
              </blockquote>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#75685f]">
                  {npcEncounterUi.yourMove}
                </p>
                {choicesLocked && (
                  <p className="border border-[#2b2320] bg-[#0a0808]/80 px-3 py-2 text-[12px] text-[#85776a]">
                    {pendingKeyChoice != null
                      ? npcEncounterUi.confirmChoice
                      : npcEncounterUi.resolving}
                  </p>
                )}
                <div className={choicesLocked ? 'pointer-events-none opacity-45' : ''}>
                  <ChoiceList
                    options={scene.options}
                    sceneId={scene.id}
                    character={character}
                    journalEntries={journalEntries}
                    raidModifierId={raidModifierId}
                    roomMarks={roomMarks}
                    onSelect={onChoice}
                    onRiskSelect={onRiskChoice}
                    isLoading={choicesLocked}
                  />
                </div>
              </div>
            )}
          </div>

          {phase === 'dialogue' && (
            <div className="flex shrink-0 border-t border-[#241919]">
              <button
                type="button"
                onClick={skipToChoices}
                className="flex-1 border-r border-[#241919] px-4 py-3.5 text-[11px] uppercase tracking-[0.14em] text-[#75685f] transition hover:bg-[#0a0808]"
              >
                {npcEncounterUi.skipToChoices}
              </button>
              <button
                type="button"
                onClick={advanceDialogue}
                className="flex-1 px-4 py-3.5 text-[11px] uppercase tracking-[0.14em] text-[#d46060] transition hover:bg-[#160909]"
              >
                {isLastLine ? npcEncounterUi.yourMove : npcEncounterUi.continue}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** @deprecated use NpcEncounterModal */
export const BreathlessEncounterModal = NpcEncounterModal
