'use client'

import { useCallback, useRef, useState } from 'react'

import type { Artifact } from '@/lib/types/game'

export function useArtifactReveal() {
  const [artifact, setArtifact] = useState<Artifact | null>(null)

  const [open, setOpen] = useState(false)

  const resolveRef = useRef<(() => void) | null>(null)

  const revealArtifact = useCallback(async (artifact: Artifact) => {
    setArtifact(artifact)

    requestAnimationFrame(() => {
      setOpen(true)
    })

    await new Promise<void>((resolve) => {
      resolveRef.current = resolve
    })
  }, [])

  const closeArtifactReveal = useCallback(() => {
    setOpen(false)

    if (resolveRef.current) {
      resolveRef.current()

      resolveRef.current = null
    }
  }, [])

  return {
    artifact,
    open,
    revealArtifact,
    closeArtifactReveal,
  }
}
