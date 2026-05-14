'use client'

import { Artifact } from '@/lib/types/game'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ArtifactRevealProps {
  artifact: Artifact | null
  open: boolean
  onClose: () => void
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

export function ArtifactReveal({
  artifact,
  open,
  onClose,
}: ArtifactRevealProps) {
  const [mounted, setMounted] = useState(false)
  const [visibleWhispers, setVisibleWhispers] = useState(0)

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
    if (!open || !artifact?.whisper?.length) return

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
  }, [open, artifact?.whisper?.length])

  if (!mounted || !artifact) {
    return null
  }

  const colors = RARITY_COLORS[artifact.rarity] || RARITY_COLORS.common

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              width: '100%',
              maxWidth: '720px',
              borderColor: colors.border,
              ['--glow' as string]: colors.glow,
            }}
            className="relative overflow-hidden border-2 bg-[#090606]"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at top, ${colors.glow}, transparent 70%)`,
              }}
            />

            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`,
              }}
            />

            <div className="relative px-12 py-14">
              <div className="text-center">
                <div className="text-[12px] uppercase tracking-[0.6em] text-[#7a6d63]">
                  RELIC UNEARTHED
                </div>

                <h2
                  className="font-cinzel mt-8 text-5xl uppercase tracking-[0.1em]"
                  style={{ color: colors.accent }}
                >
                  {artifact.name}
                </h2>

                <div className="mx-auto mt-8 flex items-center justify-center gap-4">
                  <div
                    className="h-px w-20"
                    style={{
                      background: `linear-gradient(to right, transparent, ${colors.accent})`,
                    }}
                  />
                  <div
                    className="text-[10px] uppercase tracking-[0.4em]"
                    style={{ color: colors.accent }}
                  >
                    {artifact.rarity}
                  </div>
                  <div
                    className="h-px w-20"
                    style={{
                      background: `linear-gradient(to left, transparent, ${colors.accent})`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-12 border-2 border-[#241919] bg-[#120c0c]/80 p-8">
                <div className="text-[12px] uppercase tracking-[0.35em] text-[#8e1f1f]">
                  Chronicle
                </div>

                <p className="mt-6 whitespace-pre-wrap text-[17px] leading-9 text-[#cdbfb4]">
                  {artifact.description}
                </p>

                {artifact.lore && (
                  <div className="mt-6 border-t-2 border-[#241919] pt-5 text-[14px] italic leading-7 text-[#75685f]">
                    {artifact.lore}
                  </div>
                )}
              </div>

              {(artifact.effects?.sanity || artifact.effects?.corruption) && (
                <div className="mt-8 border-2 border-[#241919] bg-black/40 p-6">
                  <div className="text-[12px] uppercase tracking-[0.3em] text-[#75685f]">
                    Influence
                  </div>

                  <div className="mt-4 space-y-3 text-[14px] text-[#d8cbc0]">
                    {artifact.effects?.sanity && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#d8d0c8]" />
                        Sanity {artifact.effects.sanity > 0 ? '+' : ''}
                        {artifact.effects.sanity}
                      </div>
                    )}

                    {artifact.effects?.corruption && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#8e1f1f]" />
                        Corruption {artifact.effects.corruption > 0 ? '+' : ''}
                        {artifact.effects.corruption}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {artifact.whisper?.length ? (
                <div className="mt-8 border-2 border-[#241919] bg-[#0d0909]/80 p-6">
                  <div className="text-[12px] uppercase tracking-[0.35em] text-[#6f6259]">
                    The Whisper
                  </div>

                  <div className="mt-4 space-y-4 italic text-[#8f7f75] text-[15px]">
                    {artifact.whisper.map((line, i) => (
                      <motion.div
                        key={line}
                        initial={{ opacity: 0, x: -10 }}
                        animate={
                          visibleWhispers > i
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

              <div className="mt-10 text-center">
                <div className="mb-6 text-[10px] uppercase tracking-[0.5em] text-[#6f6259]">
                  THE ABYSS REMEMBERS
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="
                    font-cinzel
                    border
                    bg-[#160909]
                    px-8
                    py-4
                    text-sm
                    uppercase
                    tracking-[0.3em]
                    transition-all
                    duration-300
                    hover:bg-[#220d0d]
                  "
                  style={{
                    borderColor: colors.accent,
                    color: colors.accent,
                  }}
                >
                  Accept Relic
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
