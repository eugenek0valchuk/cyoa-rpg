'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { t } from '@/lib/i18n'

export interface StatFlash {
  sanity?: number
  corruption?: number
}

interface Props {
  flash: StatFlash | null
}

export function StatChangeFlash({ flash }: Props) {
  const { game } = t.ui

  if (!flash) {
    return null
  }

  const parts: string[] = []

  if (flash.sanity !== undefined && flash.sanity !== 0) {
    const sign = flash.sanity > 0 ? '+' : ''
    parts.push(`${game.sanity} ${sign}${flash.sanity}`)
  }

  if (flash.corruption !== undefined && flash.corruption !== 0) {
    const sign = flash.corruption > 0 ? '+' : ''
    parts.push(`${game.corruption} ${sign}${flash.corruption}`)
  }

  if (parts.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        key={parts.join('|')}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="pointer-events-none mb-2 border border-[#2b3528]/80 bg-[#0d120d]/90 px-3 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-[#9aab92]"
      >
        {game.statFlashLabel}: {parts.join(' · ')}
      </motion.div>
    </AnimatePresence>
  )
}
