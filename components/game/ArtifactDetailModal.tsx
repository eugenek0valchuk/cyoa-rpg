'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { GameIcon } from './ui/GameIcon'
import {
  getArtifactEffectLines,
  getArtifactImageSrc,
  hasArtifactEffect,
} from '@/lib/game/artifactEffects'
import { t } from '@/lib/i18n'
import { zLayers } from '@/lib/ui/layers'
import type { Artifact, ArtifactEffect } from '@/lib/types/game'

export type ArtifactDetailMode = 'reveal' | 'inspect'

interface ArtifactDetailModalProps {
  artifact: Artifact | null
  open: boolean
  onClose: () => void
  mode?: ArtifactDetailMode
}

const RARITY_COLORS = {
  common: { accent: '#9a8a7f', mat: 'rgba(60,50,45,0.55)' },
  rare: { accent: '#d4c45a', mat: 'rgba(70,60,30,0.5)' },
  forbidden: { accent: '#d45050', mat: 'rgba(80,30,30,0.45)' },
  mythic: { accent: '#a898f0', mat: 'rgba(45,40,80,0.45)' },
}

const EFFECT_LABELS: Record<string, string> = {
  sanity: t.ui.game.sanity,
  corruption: t.ui.game.corruption,
  strength: t.ui.game.strength,
  agility: t.ui.game.agility,
  intelligence: t.ui.game.intelligence,
}

function RelicBracket({ className, color }: { className: string; color: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-5 w-5 ${className}`}
      style={{
        borderColor: color,
        borderStyle: 'solid',
        borderWidth: 0,
      }}
    />
  )
}

function EffectBadges({ effect, accent }: { effect?: ArtifactEffect; accent: string }) {
  const lines = getArtifactEffectLines(effect)

  if (lines.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
      {lines.map((line) => (
        <span
          key={line.key}
          className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-[13px] text-[#e0d5cc]"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}12`,
          }}
        >
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
            size={18}
          />
          {EFFECT_LABELS[line.key]} {line.delta > 0 ? '+' : ''}
          {line.delta}
        </span>
      ))}
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
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    setVisibleWhispers(0)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

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
  const hasEffects =
    hasArtifactEffect(artifact.effects) || hasArtifactEffect(artifact.onAcquire)

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={`fixed inset-0 ${zLayers.artifactInspect} flex items-center justify-center p-5 sm:p-8`}
          role="dialog"
          aria-modal="true"
        >
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#120808]/25 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            {/* внешняя рамка — «паспарту», сквозь неё виден размытый фон */}
            <div
              className="rounded-sm p-[10px] shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-sm"
              style={{
                background: colors.mat,
                boxShadow: `0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px ${colors.accent}30`,
              }}
            >
              {/* внутренняя пластина */}
              <div
                className="relative overflow-hidden rounded-sm border-2 bg-[#0c0909]/50 backdrop-blur-xl"
                style={{ borderColor: `${colors.accent}90` }}
              >
                <RelicBracket
                  className="left-2 top-2 border-l-2 border-t-2"
                  color={colors.accent}
                />
                <RelicBracket
                  className="right-2 top-2 border-r-2 border-t-2"
                  color={colors.accent}
                />
                <RelicBracket
                  className="bottom-2 left-2 border-b-2 border-l-2"
                  color={colors.accent}
                />
                <RelicBracket
                  className="bottom-2 right-2 border-b-2 border-r-2"
                  color={colors.accent}
                />

                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-2 top-2 z-20 border border-[#ffffff15] bg-black/30 p-1 text-[#9a8a80] backdrop-blur-sm transition hover:border-[#d46060]/50 hover:text-[#d46060]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* пьедестал с артом */}
                <div
                  className="relative px-6 pb-5 pt-8 text-center"
                  style={{
                    background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${colors.accent}18, transparent 70%)`,
                  }}
                >
                  <p className="text-[9px] uppercase tracking-[0.5em] text-[#8a7a70]">
                    {mode === 'reveal'
                      ? artifactDetail.revealEyebrow
                      : artifactDetail.inspectEyebrow}
                  </p>

                  <div
                    className="relative mx-auto mt-5 inline-block p-2"
                    style={{
                      boxShadow: `0 0 32px ${colors.accent}25, inset 0 0 0 1px ${colors.accent}35`,
                    }}
                  >
                    <Image
                      src={imageSrc}
                      alt={artifact.name}
                      width={200}
                      height={200}
                      className="h-[168px] w-[168px] object-cover sm:h-[184px] sm:w-[184px]"
                      unoptimized
                    />
                  </div>

                  <h2
                    className="font-cinzel mt-5 text-[1.35rem] uppercase leading-snug tracking-[0.06em] sm:text-2xl"
                    style={{ color: colors.accent }}
                  >
                    {artifact.name}
                  </h2>
                  <p
                    className="mt-2 text-[10px] uppercase tracking-[0.38em]"
                    style={{ color: `${colors.accent}cc` }}
                  >
                    {rarityLabels[artifact.rarity] ?? artifact.rarity}
                  </p>
                </div>

                <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#ffffff18] to-transparent" />

                <div className="max-h-[min(34vh,260px)] space-y-5 overflow-y-auto px-6 py-5">
                  <section>
                    <p
                      className="text-[10px] uppercase tracking-[0.34em]"
                      style={{ color: colors.accent }}
                    >
                      {artifactDetail.chronicle}
                    </p>
                    <p className="mt-2 text-[15px] leading-7 text-[#d4c8be]">
                      {artifact.description}
                    </p>
                    {artifact.lore && (
                      <p className="mt-3 text-[13px] italic leading-6 text-[#8a7d72]">
                        {artifact.lore}
                      </p>
                    )}
                  </section>

                  {hasEffects && (
                    <section className="space-y-3">
                      {hasArtifactEffect(artifact.effects) && (
                        <div>
                          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#75685f]">
                            {artifactDetail.passiveTitle}
                          </p>
                          <EffectBadges effect={artifact.effects} accent={colors.accent} />
                        </div>
                      )}
                      {hasArtifactEffect(artifact.onAcquire) && (
                        <div>
                          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#75685f]">
                            {artifactDetail.acquireTitle}
                          </p>
                          <EffectBadges effect={artifact.onAcquire} accent={colors.accent} />
                        </div>
                      )}
                    </section>
                  )}

                  {showWhispers && (
                    <section>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#6f6259]">
                        {artifactReveal.whisperTitle}
                      </p>
                      <div className="mt-2 space-y-2 text-[14px] italic text-[#9a8a80]">
                        {artifact.whisper!.map((line, index) => (
                          <motion.p
                            key={line}
                            initial={{ opacity: 0 }}
                            animate={
                              visibleWhispers > index ? { opacity: 1 } : { opacity: 0 }
                            }
                          >
                            «{line}»
                          </motion.p>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="border-t border-[#ffffff10] px-6 py-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="font-cinzel w-full border px-4 py-3 text-sm uppercase tracking-[0.2em] transition hover:brightness-110"
                    style={{
                      borderColor: `${colors.accent}80`,
                      color: colors.accent,
                      background: `${colors.accent}10`,
                    }}
                  >
                    {mode === 'reveal'
                      ? artifactReveal.acceptRelic
                      : artifactDetail.close}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
