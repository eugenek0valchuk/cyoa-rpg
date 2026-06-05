'use client'

import { ArtifactDetailModal } from './ArtifactDetailModal'
import type { Artifact } from '@/lib/types/game'

interface ArtifactRevealProps {
  artifact: Artifact | null
  open: boolean
  onClose: () => void
}

export function ArtifactReveal({ artifact, open, onClose }: ArtifactRevealProps) {
  return (
    <ArtifactDetailModal
      artifact={artifact}
      open={open}
      onClose={onClose}
      mode="reveal"
    />
  )
}
