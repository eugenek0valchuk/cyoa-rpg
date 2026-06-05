'use client'

import Link from 'next/link'

import { t } from '@/lib/i18n'

export default function HomePage() {
  const { home } = t.ui

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-zinc-100">
      <img
        src="/main-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <section className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="w-full max-w-[520px] border border-[#3b3028]/80 bg-[#080505]/88 px-10 py-14 shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-[2px]">
          <div className="text-center">
            <h1 className="font-cinzel text-6xl uppercase tracking-[0.14em] text-[#d6cdc3]">
              {home.titleLine1}
            </h1>

            <h1 className="font-cinzel mt-1 text-7xl uppercase tracking-[0.12em] text-[#8e1f1f]">
              {home.titleLine2}
            </h1>

            <div className="mx-auto mt-10 max-w-[320px] space-y-5 text-[15px] leading-8 text-[#85776a]">
              <p>
                {home.tagline1}
                <br />
                {home.tagline1b}
              </p>

              <p>
                {home.tagline2}
                <br />
                {home.tagline2b}
              </p>
            </div>
          </div>

          <div className="mt-14 space-y-4">
            <Link
              href="/archives"
              className="group block border border-[#4b2a2a] bg-[#120909]/70 px-6 py-5 no-underline visited:text-inherit hover:border-[#8e1f1f] hover:bg-[#1a0d0d]"
            >
              <div className="text-center">
                <div className="font-cinzel text-3xl uppercase tracking-[0.18em] text-[#c84a4a] group-hover:text-[#ff6b6b]">
                  {home.begin}
                </div>

                <div className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#6d5d53]">
                  {home.beginSub}
                </div>
              </div>
            </Link>

            <Link
              href="/archives"
              className="group block border border-[#4b2a2a] bg-[#120909]/70 px-6 py-5 no-underline visited:text-inherit hover:border-[#8e1f1f] hover:bg-[#1a0d0d]"
            >
              <div className="text-center">
                <div className="font-cinzel text-3xl uppercase tracking-[0.18em] text-[#c84a4a] group-hover:text-[#ff6b6b]">
                  {home.archives}
                </div>

                <div className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#6d5d53]">
                  {home.archivesSub}
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-14 text-center">
            <p className="text-[15px] leading-8 tracking-[0.08em] text-[#7b6f63]">
              {home.footer1}
              <br />
              {home.footer2}
            </p>

            <div className="mt-8 text-[10px] uppercase tracking-[0.4em] text-[#4c433d]">
              {home.version}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
