// components/game/LoadingOverlay.tsx
import { Loader2, Sparkles } from 'lucide-react'

interface LoadingOverlayProps {
  show: boolean
  message?: string
}

export function LoadingOverlay({
  show,
  message = 'The storyteller weaves the next chapter...',
}: LoadingOverlayProps) {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-gray-800/90 border border-gray-700 p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-blue-500 animate-ping opacity-20" />
          </div>
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4 relative z-10" />
        </div>
        <p className="text-white text-lg font-medium">{message}</p>
        <p className="text-gray-400 text-sm mt-2">Generating your destiny...</p>
      </div>
    </div>
  )
}
