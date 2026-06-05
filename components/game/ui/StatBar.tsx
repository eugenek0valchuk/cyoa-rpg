'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StatBarProps {
  label: string
  value: number
  max: number
  color: string
  icon?: ReactNode
  bgColor?: string
  trackColor?: string
  compact?: boolean
}

export function StatBar({
  label,
  value,
  max,
  color,
  icon,
  bgColor = '#1b1414',
  trackColor = color,
  compact = false,
}: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))

  if (compact) {
    return (
      <div className="min-w-0 flex-1 border border-[#241919] bg-black/35 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {icon && <span className="shrink-0 opacity-80">{icon}</span>}
            <span className="truncate text-[10px] uppercase tracking-[0.12em] text-[#75685f]">
              {label}
            </span>
          </div>
          <span className="font-cinzel shrink-0 text-base tabular-nums" style={{ color }}>
            {value}
          </span>
        </div>
        <div className="mt-2 h-[3px] overflow-hidden" style={{ background: bgColor }}>
          <motion.div
            className="h-full"
            style={{ background: trackColor }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="border-2 border-[#2b2320] bg-[#0a0707]/90 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon && <span className="shrink-0 text-[#7a6d63]">{icon}</span>}
          <div className="truncate text-[12px] uppercase tracking-[0.2em] text-[#7a6d63]">
            {label}
          </div>
        </div>

        <div className="flex shrink-0 items-baseline gap-1">
          <motion.span
            key={value}
            className="font-cinzel text-2xl tabular-nums"
            style={{ color }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.span>
          <span className="text-xs text-[#7a6d63]">/{max}</span>
        </div>
      </div>

      <div className="mt-3 h-[4px] overflow-hidden" style={{ background: bgColor }}>
        <motion.div
          className="h-full"
          style={{ background: trackColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
