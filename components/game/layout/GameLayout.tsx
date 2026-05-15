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
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_250px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(80,10,10,0.1)]" />

      <section className="relative z-10 mx-auto max-w-[1100px] pt-[5vh] pb-12">
        {children}
      </section>
    </main>
  )
}
