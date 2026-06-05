'use client'

import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function GameLayout({ children }: Props) {
  return (
    <main className="relative isolate h-screen overflow-hidden bg-black text-[#e7ded7]">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/85" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(142,31,31,0.12),transparent_50%)]" />
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.85)]" />

      <section className="relative z-10 mx-auto flex h-full min-h-0 max-w-[980px] flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-6">
        {children}
      </section>
    </main>
  )
}
