'use client'

import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

import { ambientController } from '@/lib/audio/AmbientController'
import { t } from '@/lib/i18n'

export function AmbientAudioToggle() {
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMuted(ambientController.isMuted())

    const onPointer = () => {
      void ambientController.ensureStarted().then((started) => {
        setReady(started)
        setMuted(ambientController.isMuted())
      })
    }

    window.addEventListener('pointerdown', onPointer, { once: true })

    return () => {
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  const toggle = async () => {
    const started = await ambientController.ensureStarted()
    setReady(started)
    setMuted(ambientController.toggleMute())
  }

  const label = muted ? t.ui.audio.unmute : t.ui.audio.mute

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={ready ? label : t.ui.audio.clickToEnable}
      className="fixed bottom-3 right-3 z-[120] flex h-9 w-9 items-center justify-center border border-[#2b2320]/90 bg-black/75 text-[#75685f] backdrop-blur-sm transition hover:border-[#5c1f1f]/70 hover:text-[#d8c9be] sm:bottom-4 sm:right-4"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
  )
}
