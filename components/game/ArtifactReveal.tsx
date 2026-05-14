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

export function ArtifactReveal({
  artifact,
  open,
  onClose,
}: ArtifactRevealProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!mounted || !artifact) {
    return null
  }

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
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
            }}
            style={{
              width: '100%',
              maxWidth: '720px',
            }}
            className="
              relative
              overflow-hidden
              border
              border-[#3b2626]
              bg-[#090606]
              shadow-[0_0_120px_rgba(120,20,20,0.45)]
            "
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,20,20,0.12),transparent_70%)]" />

            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9f2e2e] to-transparent" />

            <div className="relative px-10 py-12">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.7em] text-[#7a6d63]">
                  RELIC UNEARTHED
                </div>

                <h2 className="font-cinzel mt-6 text-4xl uppercase tracking-[0.12em] text-[#efe4da]">
                  {artifact.name}
                </h2>

                <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-[#8e1f1f] to-transparent" />
              </div>

              <div className="mt-10 border border-[#241919] bg-[#120c0c]/80 p-6">
                <div className="text-[11px] uppercase tracking-[0.4em] text-[#8e1f1f]">
                  Chronicle
                </div>

                <p className="mt-5 whitespace-pre-wrap text-[15px] leading-8 text-[#cdbfb4]">
                  {artifact.description}
                </p>
              </div>

              {(artifact.effects?.sanity || artifact.effects?.corruption) && (
                <div className="mt-6 border border-[#241919] bg-black/40 p-5">
                  <div className="text-[11px] uppercase tracking-[0.35em] text-[#75685f]">
                    Influence
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-[#d8cbc0]">
                    {artifact.effects?.sanity && (
                      <div>
                        Sanity {artifact.effects.sanity > 0 ? '+' : ''}
                        {artifact.effects.sanity}
                      </div>
                    )}

                    {artifact.effects?.corruption && (
                      <div>
                        Corruption {artifact.effects.corruption > 0 ? '+' : ''}
                        {artifact.effects.corruption}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {artifact.whisper?.length ? (
                <div className="mt-6 border border-[#241919] bg-[#0d0909]/80 p-5">
                  <div className="text-[10px] uppercase tracking-[0.45em] text-[#6f6259]">
                    The Whisper
                  </div>

                  <div className="mt-4 space-y-3 italic text-[#8f7f75]">
                    {artifact.whisper.map((line) => (
                      <div key={line}>“{line}”</div>
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
                    border-[#5c1f1f]
                    bg-[#160909]
                    px-8
                    py-4
                    text-sm
                    uppercase
                    tracking-[0.3em]
                    text-[#d46060]
                    transition-all
                    duration-300
                    hover:bg-[#220d0d]
                    hover:text-[#ff7b7b]
                  "
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
