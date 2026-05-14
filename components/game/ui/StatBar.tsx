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
}

export function StatBar({
  label,
  value,
  max,
  color,
  icon,
  bgColor = '#1b1414',
  trackColor = color,
}: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))

  return (
    <div className="border-2 border-[#2b2320] bg-[#0a0707]/90 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-[#7a6d63]">{icon}</span>}
          <div className="text-[12px] uppercase tracking-[0.35em] text-[#7a6d63]">
            {label}
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <motion.span
            key={value}
            className="font-cinzel text-4xl"
            style={{ color }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.span>
          <span className="mb-1 text-sm text-[#7a6d63]">/{max}</span>
        </div>
      </div>

      <div
        className="mt-4 h-[4px] overflow-hidden"
        style={{ background: bgColor }}
      >
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
