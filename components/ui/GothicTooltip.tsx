'use client'

import { createPortal } from 'react-dom'
import { useCallback, useRef, useState, type ReactNode } from 'react'

interface GothicTooltipProps {
  title: string
  body?: string
  children: ReactNode
}

export function GothicTooltip({ title, body, children }: GothicTooltipProps) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) {
      return
    }

    const rect = anchor.getBoundingClientRect()
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    })
  }, [])

  const show = () => {
    updatePosition()
    setOpen(true)
  }

  const hide = () => setOpen(false)

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </span>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[400] w-max max-w-[260px] -translate-x-1/2 -translate-y-full border border-[#3b2a2a] bg-[#0d0909]/98 px-3 py-2 shadow-[0_8px_28px_rgba(0,0,0,0.7)]"
            style={{ left: position.x, top: position.y }}
          >
            <div className="text-[11px] uppercase tracking-[0.1em] text-[#efe5dc]">
              {title}
            </div>
            {body && (
              <p className="mt-1 text-[11px] leading-relaxed text-[#9d8d82]">
                {body}
              </p>
            )}
          </div>,
          document.body,
        )}
    </>
  )
}
