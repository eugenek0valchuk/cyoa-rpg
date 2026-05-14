'use client'

import { RotateCcw } from 'lucide-react'

interface Props {
  isLoading: boolean
  onReset: () => void
}

export function GameHeader({ isLoading, onReset }: Props) {
  return (
    <div className="mb-10 flex items-start justify-between gap-6">
      <div className="flex-1 text-center">
        <div className="text-[10px] uppercase tracking-[0.7em] text-[#6d5e55]">
          THE CHRONICLE CONTINUES
        </div>

        <div className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-[#7a2222] to-transparent" />
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={isLoading}
        className="
          group
          inline-flex
          items-center
          gap-2
          border
          border-[#241919]
          bg-[#0f0a0a]/80
          px-4
          py-2
          text-[9px]
          uppercase
          tracking-[0.32em]
          text-[#6f6259]
          transition-all
          duration-300
          hover:border-[#4a2323]
          hover:bg-[#161010]
          hover:text-[#d7c8bc]
          disabled:pointer-events-none
          disabled:opacity-40
        "
      >
        <RotateCcw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" />

        <span>Return</span>
      </button>
    </div>
  )
}
