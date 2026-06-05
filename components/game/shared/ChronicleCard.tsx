import { ReactNode } from 'react'
import clsx from 'clsx'

interface ChronicleCardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  contentClassName?: string
  titleClassName?: string
  icon?: ReactNode
  maxHeight?: string
  /** When false, body grows with content — parent supplies the only scroll */
  scrollBody?: boolean
}

export function ChronicleCard({
  title,
  subtitle,
  children,
  className,
  contentClassName,
  titleClassName,
  icon,
  maxHeight = 'max-h-[40vh]',
  scrollBody = true,
}: ChronicleCardProps) {
  return (
    <section
      className={clsx(
        'relative overflow-hidden border-2 border-[#2b2320] bg-[#0d0909]/95 shadow-[0_0_60px_rgba(0,0,0,0.5)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l border-t border-[#8e1f1f]/30" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b border-r border-[#8e1f1f]/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,31,31,0.06),transparent_60%)]" />

      {(title || subtitle) && (
        <div className="border-b-2 border-[#241919] bg-[#120d0d] px-6 py-4">
          <div className="flex items-center gap-4">
            {icon && <span className="text-[#8e1f1f]">{icon}</span>}

            <div>
              {subtitle && (
                <div className="text-[12px] uppercase tracking-[0.35em] text-[#75685f]">
                  {subtitle}
                </div>
              )}

              {title && (
                <h2
                  className={clsx(
                    'mt-1 font-cinzel uppercase tracking-[0.08em] text-[#ece2d9]',
                    titleClassName ?? 'text-3xl',
                  )}
                >
                  {title}
                </h2>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={clsx(
          'relative px-4 py-4',
          scrollBody && 'overflow-y-auto chronicle-scrollbar scroll-smooth',
          scrollBody && maxHeight,
          contentClassName,
        )}
      >
        {/* Fade overlays - always present, subtle atmospheric effect */}
        <div className="chronicle-fade-top pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#0d0909] to-transparent" />
        <div className="chronicle-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0d0909] to-transparent" />

        {children}
      </div>
    </section>
  )
}
