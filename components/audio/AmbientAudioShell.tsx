'use client'

import { AmbientAudioToggle } from './AmbientAudioToggle'

export function AmbientAudioShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AmbientAudioToggle />
    </>
  )
}
