'use client'

import { createPortal } from 'react-dom'
import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

import { GameIcon, type GameIconProps } from '@/components/game/ui/GameIcon'

interface GothicModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: GameIconProps['type']
  children: ReactNode
  footer?: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const WIDTH = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const

export function GothicModal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'md',
}: GothicModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 pb-24 sm:p-6 sm:pb-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gothic-modal-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className={`relative z-10 flex max-h-[min(88vh,720px)] w-full flex-col border-2 border-[#3b2a2a] bg-[#0d0909] shadow-[0_0_80px_rgba(92,31,31,0.25)] ${WIDTH[maxWidth]}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#241919] bg-[#120d0d] px-5 py-4">
          <div className="flex min-w-0 items-start gap-4">
            {icon && (
              <div className="shrink-0 pt-1">
                <GameIcon type={icon} size={44} />
              </div>
            )}
            <div className="min-w-0">
              <h2
                id="gothic-modal-title"
                className="font-cinzel text-xl uppercase tracking-[0.1em] text-[#efe5dc] sm:text-2xl"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="mt-1 text-[14px] leading-relaxed text-[#9d8d82]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 border border-[#2b2320] p-2 text-[#75685f] transition hover:border-[#5c1f1f] hover:text-[#d46060]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-[#241919] bg-[#0a0707] px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
