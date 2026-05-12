'use client'

import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function GameLayout({ children }: Props) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-4 text-[#e7ded7]">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.95)]" />

      <section className="relative z-10 mx-auto max-w-[920px] pt-[18vh] pb-24">
        {children}
      </section>
    </main>
  )
}
