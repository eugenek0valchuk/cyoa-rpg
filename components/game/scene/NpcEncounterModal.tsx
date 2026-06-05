'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

import { ChoiceList } from '@/components/game/scene/ChoiceList'
import { GameIcon } from '@/components/game/ui/GameIcon'
import {
  buildNpcEncounterDialogue,
  buildNpcReplyTurns,
  getChoiceReplyForScene,
  type NpcDialogueTurn,
} from '@/lib/game/npcEncounter'
import { getRiskOffer } from '@/lib/game/riskCheck'
import { zLayers } from '@/lib/ui/layers'
import { npcEncounterUi } from '@/locales/ru/npcEncounters'
import type { RaidModifierId } from '@/lib/game/raidModifiers'
import type { Character, Scene } from '@/lib/types/game'
import { renderNarrativeEmphasis } from '@/components/game/shared/NarrativeText'

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
  /** Сброс после провала проверки без смены сцены */
  encounterResetKey?: number
  onChoice: (choiceIndex: number) => void
  onRiskChoice?: (choiceIndex: number) => void
}

type Phase = 'dialogue' | 'choices' | 'reply'

function DialogueTurnView({ turn }: { turn: NpcDialogueTurn }) {
  if (turn.speaker === 'player') {
    return (
      <div className="ml-3 border-r-2 border-[#5c4040]/80 pr-3 text-right sm:ml-6">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#75685f]">
          {npcEncounterUi.playerVoice}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#b8a99e]">
          {renderNarrativeEmphasis(turn.text)}
        </p>
      </div>
    )
  }

  const trimmed = turn.text.trim()
  const inner =
    trimmed.startsWith('«') && trimmed.endsWith('»')
      ? trimmed.slice(1, -1).trim()
      : trimmed

  return (
    <blockquote className="border-l-2 border-[#8e1f1f]/70 pl-3 text-[14px] leading-relaxed text-[#cfc2b8]">
      «{renderNarrativeEmphasis(inner)}»
    </blockquote>
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
  encounterResetKey = 0,
  onChoice,
  onRiskChoice,
}: NpcEncounterModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [imageFailed, setImageFailed] = useState(false)

  const encounter = useMemo(
    () =>
      buildNpcEncounterDialogue(scene.id, journalEntries, visitedSceneIds),
    [scene.id, journalEntries, visitedSceneIds],
  )

  const def = encounter.def
  const lines = encounter.lines

  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<Phase>('dialogue')
  const [pendingChoiceIndex, setPendingChoiceIndex] = useState<number | null>(
    null,
  )
  const [replyStep, setReplyStep] = useState(0)
  const [replyTurns, setReplyTurns] = useState<NpcDialogueTurn[]>([])

  useEffect(() => {
    setStep(0)
    setPhase('dialogue')
    setPendingChoiceIndex(null)
    setReplyStep(0)
    setReplyTurns([])
    setImageFailed(false)
  }, [scene.id])

  useEffect(() => {
    if (encounterResetKey <= 0) {
      return
    }

    setStep(Math.max(0, lines.length - 1))
    setPhase('choices')
    setPendingChoiceIndex(null)
    setReplyStep(0)
    setReplyTurns([])
  }, [encounterResetKey, lines.length])

  useEffect(() => {
    if (!open) {
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const openingTurns = useMemo<NpcDialogueTurn[]>(
    () => lines.map((line) => ({ speaker: 'npc', text: line })),
    [lines],
  )

  const visibleOpeningCount =
    phase === 'dialogue' ? step + 1 : openingTurns.length

  const visibleReplyCount =
    phase === 'reply' ? replyStep + 1 : phase === 'choices' ? 0 : 0

  const transcript = useMemo(() => {
    const turns = openingTurns.slice(0, visibleOpeningCount)

    if (phase === 'reply' || (phase === 'choices' && replyTurns.length > 0)) {
      turns.push(...replyTurns.slice(0, visibleReplyCount))
    }

    return turns
  }, [
    openingTurns,
    visibleOpeningCount,
    phase,
    replyTurns,
    visibleReplyCount,
  ])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [transcript.length, step, replyStep, phase])

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
    setStep(Math.max(0, lines.length - 1))
    setPhase('choices')
  }, [lines.length])

  const commitChoice = useCallback(
    (index: number) => {
      const choice = scene.options[index]

      if (!choice) {
        return
      }

      const riskOffer = getRiskOffer(choice, character, journalEntries)

      if (riskOffer && onRiskChoice) {
        onRiskChoice(index)
        return
      }

      onChoice(index)
    },
    [character, journalEntries, onChoice, onRiskChoice, scene.options],
  )

  const handlePickChoice = useCallback(
    (index: number) => {
      const choice = scene.options[index]

      if (!choice) {
        return
      }

      const reply = getChoiceReplyForScene(
        scene.id,
        choice.id,
        journalEntries,
        visitedSceneIds,
      )

      if (reply && (reply.player || reply.npc.length > 0 || reply.epilogue)) {
        setReplyTurns(buildNpcReplyTurns(reply))
        setReplyStep(0)
        setPendingChoiceIndex(index)
        setPhase('reply')
        return
      }

      commitChoice(index)
    },
    [
      commitChoice,
      journalEntries,
      scene.id,
      scene.options,
      visitedSceneIds,
    ],
  )

  const finishReply = useCallback(() => {
    const index = pendingChoiceIndex

    setPendingChoiceIndex(null)
    setReplyStep(0)

    if (index != null) {
      commitChoice(index)
    }
  }, [commitChoice, pendingChoiceIndex])

  const advanceReply = useCallback(() => {
    if (replyStep >= replyTurns.length - 1) {
      finishReply()
      return
    }

    setReplyStep((value) => value + 1)
  }, [finishReply, replyStep, replyTurns.length])

  useEffect(() => {
    if (!open || phase === 'choices') {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()

        if (phase === 'dialogue') {
          advanceDialogue()
          return
        }

        if (phase === 'reply') {
          advanceReply()
        }

        return
      }

      if (event.key === 'Escape' && phase === 'dialogue') {
        event.preventDefault()
        skipToChoices()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [advanceDialogue, advanceReply, open, phase, skipToChoices])

  const choicesLocked = isLoading || pendingKeyChoice != null

  if (!open || !def || typeof document === 'undefined') {
    return null
  }

  const isLastLine = step >= lines.length - 1
  const isLastReply = replyStep >= replyTurns.length - 1

  return createPortal(
    <div
      data-testid="npc-encounter-modal"
      className={`fixed inset-0 ${zLayers.npcEncounter} flex items-center justify-center p-2 sm:p-5`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="npc-encounter-title"
    >
      <div className="absolute inset-0 bg-black/86 backdrop-blur-[2px]" />

      <div className="relative z-10 flex h-[min(92vh,760px)] w-full max-w-7xl flex-col overflow-hidden border-2 border-[#4a3030] bg-[#0a0707] shadow-[0_0_80px_rgba(92,31,31,0.35)] lg:flex-row">
        <div className="relative flex min-h-[min(42vh,340px)] w-full shrink-0 items-center justify-center bg-[#080606] lg:min-h-0 lg:min-w-0 lg:flex-1">
          {!imageFailed ? (
            <Image
              src={def.imageSrc}
              alt=""
              fill
              className="object-contain object-center p-1 sm:p-2"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <GameIcon type={def.icon} size={120} />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0707] via-transparent to-black/25" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-[#0a0707]/90 to-transparent lg:block" />

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

        <div className="flex min-h-0 w-full shrink-0 flex-col border-t border-[#2b2320] lg:w-[24rem] lg:border-l lg:border-t-0 xl:w-[26rem]">
          <div className="shrink-0 border-b border-[#241919] bg-[#120d0d] px-4 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#75685f]">
              {scene.title}
              {phase === 'reply' && (
                <span className="text-[#8e1f1f]">
                  {' '}
                  · {npcEncounterUi.afterChoice}
                </span>
              )}
              {phase === 'dialogue' && lines.length > 1 && (
                <span className="text-[#5a5048]">
                  {' '}
                  · {step + 1}/{lines.length}
                </span>
              )}
            </p>
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto chronicle-scrollbar px-4 py-3 sm:px-4"
          >
            {transcript.length > 0 && (
              <div className="space-y-3 pb-3">
                {transcript.map((turn, index) => (
                  <DialogueTurnView key={`${turn.speaker}-${index}`} turn={turn} />
                ))}
              </div>
            )}

            {phase === 'choices' && (
              <div className="space-y-3 border-t border-[#241919]/80 pt-3">
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
                <div
                  className={
                    choicesLocked ? 'pointer-events-none opacity-45' : ''
                  }
                >
                  <ChoiceList
                    options={scene.options}
                    sceneId={scene.id}
                    character={character}
                    journalEntries={journalEntries}
                    raidModifierId={raidModifierId}
                    roomMarks={roomMarks}
                    onSelect={handlePickChoice}
                    onRiskSelect={handlePickChoice}
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
                data-testid="npc-encounter-skip"
                onClick={skipToChoices}
                className="flex-1 border-r border-[#241919] px-3 py-3 text-[10px] uppercase tracking-[0.12em] text-[#75685f] transition hover:bg-[#0a0808]"
              >
                {npcEncounterUi.skipToChoices}
              </button>
              <button
                type="button"
                onClick={advanceDialogue}
                className="flex-1 px-3 py-3 text-[10px] uppercase tracking-[0.12em] text-[#d46060] transition hover:bg-[#160909]"
              >
                {isLastLine ? npcEncounterUi.yourMove : npcEncounterUi.continue}
              </button>
            </div>
          )}

          {phase === 'reply' && (
            <div className="flex shrink-0 border-t border-[#241919]">
              <button
                type="button"
                onClick={advanceReply}
                className="w-full px-3 py-3 text-[10px] uppercase tracking-[0.12em] text-[#d46060] transition hover:bg-[#160909]"
              >
                {isLastReply ? npcEncounterUi.resolving : npcEncounterUi.continue}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
