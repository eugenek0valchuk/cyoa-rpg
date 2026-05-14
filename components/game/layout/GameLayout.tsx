'use client'

import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function GameLayout({ children }: Props) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-6 text-[#e7ded7]">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/90" />

      <div className="absolute inset-0 shadow-[inset_0_0_300px_rgba(0,0,0,0.95)_inset_0_0_100px_rgba(80,10,10,0.15)]" />

      <section className="relative z-10 mx-auto max-w-[1100px] pt-[8vh] pb-16">
        {children}
      </section>
    </main>
  )
}
