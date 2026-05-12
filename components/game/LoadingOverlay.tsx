import { Loader2, Flame } from 'lucide-react'

interface LoadingOverlayProps {
  show: boolean

  message?: string
}

export function LoadingOverlay({
  show,
  message = 'The abyss answers...',
}: LoadingOverlayProps) {
  if (!show) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
      <div className="relative overflow-hidden border border-[#2b2320] bg-[#0b0808]/95 px-10 py-10 text-center shadow-[0_0_80px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(142,31,31,0.14),transparent_70%)]" />

        <div className="relative z-10">
          <Flame className="mx-auto mb-5 h-10 w-10 text-[#8e1f1f] opacity-80" />

          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#d8c7bc]" />

          <div className="mt-8 text-[11px] uppercase tracking-[0.45em] text-[#75685f]">
            DESCENT CONTINUES
          </div>

          <p className="mt-5 max-w-sm text-[15px] leading-8 text-[#d7c8bc]">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
