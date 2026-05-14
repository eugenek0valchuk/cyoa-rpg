import { ReactNode } from 'react'
import clsx from 'clsx'

interface ChronicleCardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
  contentClassName?: string
  icon?: ReactNode
}

export function ChronicleCard({
  title,
  subtitle,
  children,
  className,
  contentClassName,
  icon,
}: ChronicleCardProps) {
  return (
    <section
      className={clsx(
        'relative overflow-hidden border border-[#2b2320] bg-[#0d0909]/95 shadow-[0_0_40px_rgba(0,0,0,0.45)]',
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="border-b border-[#241919] bg-[#120d0d] px-6 py-4">
          <div className="flex items-center gap-3">
            {icon}

            <div>
              {subtitle && (
                <div className="text-[10px] uppercase tracking-[0.35em] text-[#75685f]">
                  {subtitle}
                </div>
              )}

              {title && (
                <h2 className="mt-1 font-cinzel text-2xl uppercase tracking-[0.08em] text-[#ece2d9]">
                  {title}
                </h2>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={clsx('px-7 py-7', contentClassName)}>{children}</div>
    </section>
  )
}
