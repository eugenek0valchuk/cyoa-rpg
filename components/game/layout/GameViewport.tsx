'use client'

import clsx from 'clsx'

interface Props {
  loading: boolean
  blocked: boolean
  children: React.ReactNode
}

export function GameViewport({ loading, blocked, children }: Props) {
  return (
    <div
      className={clsx(
        'flex min-h-0 flex-1 flex-col overflow-hidden',
        blocked
          ? ''
          : loading
            ? 'opacity-50 transition-opacity duration-300'
            : 'transition-opacity duration-300',
      )}
    >
      {children}
    </div>
  )
}
