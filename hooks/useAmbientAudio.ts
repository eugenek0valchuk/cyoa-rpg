'use client'

import { useEffect } from 'react'

import {
  ambientController,
  type AmbientSceneMode,
} from '@/lib/audio/AmbientController'

interface UseAmbientAudioOptions {
  mode: AmbientSceneMode
  tense?: boolean
  enabled?: boolean
}

function applyAmbient(mode: AmbientSceneMode, tense: boolean) {
  void ambientController.ensureStarted().then(() => {
    ambientController.setSceneMode(mode)
    ambientController.setTense(tense)
  })
}

export function useAmbientAudio({
  mode,
  tense = false,
  enabled = true,
}: UseAmbientAudioOptions) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return
    }

    if (ambientController.hasUnlocked()) {
      applyAmbient(mode, tense)
    }

    const unlock = () => {
      applyAmbient(mode, tense)
    }

    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [enabled, mode, tense])

  useEffect(() => {
    return () => {
      if (enabled) {
        ambientController.setSceneMode('off')
        ambientController.setTense(false)
      }
    }
  }, [enabled])
}
