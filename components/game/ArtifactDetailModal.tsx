'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { GameIcon } from './ui/GameIcon'
import {
  getArtifactEffectLines,
  getArtifactImageSrc,
  hasArtifactEffect,
} from '@/lib/game/artifactEffects'
import { t } from '@/lib/i18n'
import type { Artifact } from '@/lib/types/game'

export type ArtifactDetailMode = 'reveal' | 'inspect'

interface ArtifactDetailModalProps {
  artifact: Artifact | null
  open: boolean
  onClose: () => void
  mode?: ArtifactDetailMode
}

const RARITY_COLORS = {
  common: {
    border: '#3b3028',
    accent: '#8f7f75',
    glow: 'rgba(120,100,80,0.3)',
  },
  rare: { border: '#3b3b26', accent: '#c8b84a', glow: 'rgba(200,184,74,0.3)' },
  forbidden: {
    border: '#3b2626',
    accent: '#9f2e2e',
    glow: 'rgba(159,46,46,0.4)',
  },
  mythic: {
    border: '#26263b',
    accent: '#7d6dd8',
    glow: 'rgba(125,109,216,0.35)',
  },
}

const EFFECT_LABELS: Record<string, string> = {
  sanity: t.ui.game.sanity,
  corruption: t.ui.game.corruption,
  strength: t.ui.game.strength,
  agility: t.ui.game.agility,
  intelligence: t.ui.game.intelligence,
}

function EffectBlock({
  title,
  artifact,
  effectKey,
}: {
  title: string
  artifact: Artifact
  effectKey: 'effects' | 'onAcquire'
}) {
  const effect = artifact[effectKey]
  const lines = getArtifactEffectLines(effect)

  if (lines.length === 0) {
    return null
  }

  return (
    <div className="border-2 border-[#241919] bg-black/40 p-5">
      <div className="text-[12px] uppercase tracking-[0.3em] text-[#75685f]">
        {title}
      </div>
      <div className="mt-3 space-y-2 text-[14px] text-[#d8cbc0]">
        {lines.map((line) => (
          <div key={`${effectKey}-${line.key}`} className="flex items-center gap-2">
            <GameIcon
              type={
                line.key === 'corruption'
                  ? 'corruption'
                  : line.key === 'sanity'
                    ? 'sanity'
                    : line.key === 'strength'
                      ? 'strength'
                      : line.key === 'agility'
                        ? 'agility'
                        : 'intelligence'
              }
              size={20}
            />
            <span>
              {EFFECT_LABELS[line.key]} {line.delta > 0 ? '+' : ''}
              {line.delta}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ArtifactDetailModal({
  artifact,
  open,
  onClose,
  mode = 'inspect',
}: ArtifactDetailModalProps) {
  const [mounted, setMounted] = useState(false)
  const [visibleWhispers, setVisibleWhispers] = useState(0)
  const { artifactDetail, artifactReveal, rarity: rarityLabels } = t.ui

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setVisibleWhispers(0)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open || !artifact?.whisper?.length || mode !== 'reveal') {
      return
    }

    const timer = setInterval(() => {
      setVisibleWhispers((prev) => {
        if (prev >= (artifact.whisper?.length || 0)) {
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, 1200)

    return () => clearInterval(timer)
  }, [open, artifact?.whisper?.length, mode])

  if (!mounted || !artifact) {
    return null
  }

  const colors = RARITY_COLORS[artifact.rarity] || RARITY_COLORS.common
  const imageSrc = getArtifactImageSrc(artifact)
  const showWhispers = mode === 'reveal' && (artifact.whisper?.length ?? 0) > 0

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/94 p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              borderColor: colors.border,
              ['--glow' as string]: colors.glow,
            }}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto border-2 bg-[#090606]"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at top, ${colors.glow}, transparent 70%)`,
              }}
            />

            <div className="relative px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="mx-auto shrink-0 sm:mx-0">
                  <div
                    className="relative overflow-hidden border-2 bg-black/50"
                    style={{ borderColor: colors.border }}
                  >
                    <Image
                      src={imageSrc}
                      alt={artifact.name}
                      width={220}
                      height={220}
                      className="h-[180px] w-[180px] object-cover sm:h-[220px] sm:w-[220px]"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="text-[11px] uppercase tracking-[0.45em] text-[#7a6d63]">
                    {mode === 'reveal'
                      ? artifactDetail.revealEyebrow
                      : artifactDetail.inspectEyebrow}
                  </div>
                  <h2
                    className="font-cinzel mt-3 text-3xl uppercase tracking-[0.08em] sm:text-4xl"
                    style={{ color: colors.accent }}
                  >
                    {artifact.name}
                  </h2>
                  <div
                    className="mt-3 text-[10px] uppercase tracking-[0.35em]"
                    style={{ color: colors.accent }}
                  >
                    {rarityLabels[artifact.rarity] ?? artifact.rarity}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-2 border-[#241919] bg-[#120c0c]/80 p-6">
                <div className="text-[12px] uppercase tracking-[0.35em] text-[#8e1f1f]">
                  {artifactDetail.chronicle}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-[16px] leading-8 text-[#cdbfb4]">
                  {artifact.description}
                </p>
                {artifact.lore && (
                  <div className="mt-5 border-t-2 border-[#241919] pt-4 text-[14px] italic leading-7 text-[#75685f]">
                    {artifact.lore}
                  </div>
                )}
              </div>

              {(hasArtifactEffect(artifact.effects) ||
                hasArtifactEffect(artifact.onAcquire)) && (
                <div className="mt-6 space-y-3">
                  <EffectBlock
                    title={artifactDetail.passiveTitle}
                    artifact={artifact}
                    effectKey="effects"
                  />
                  <EffectBlock
                    title={artifactDetail.acquireTitle}
                    artifact={artifact}
                    effectKey="onAcquire"
                  />
                </div>
              )}

              {showWhispers ? (
                <div className="mt-6 border-2 border-[#241919] bg-[#0d0909]/80 p-6">
                  <div className="text-[12px] uppercase tracking-[0.35em] text-[#6f6259]">
                    {artifactReveal.whisperTitle}
                  </div>
                  <div className="mt-4 space-y-3 text-[15px] italic text-[#8f7f75]">
                    {artifact.whisper!.map((line, index) => (
                      <motion.div
                        key={line}
                        initial={{ opacity: 0, x: -10 }}
                        animate={
                          visibleWhispers > index
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -10 }
                        }
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      >
                        “{line}”
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="font-cinzel border bg-[#160909] px-8 py-3 text-sm uppercase tracking-[0.25em] transition hover:bg-[#220d0d]"
                  style={{
                    borderColor: colors.accent,
                    color: colors.accent,
                  }}
                >
                  {mode === 'reveal'
                    ? artifactReveal.acceptRelic
                    : artifactDetail.close}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
