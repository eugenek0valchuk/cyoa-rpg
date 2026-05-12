'use client'

interface Props {
  loading: boolean

  blocked: boolean

  children: React.ReactNode
}

export function GameViewport({ loading, blocked, children }: Props) {
  return (
    <div
      className={
        blocked
          ? ''
          : loading
            ? 'opacity-50 transition-opacity duration-300'
            : 'transition-opacity duration-300'
      }
    >
      {children}
    </div>
  )
}
