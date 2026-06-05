'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  chunkRevealDelayMs,
  splitNarrativeChunks,
} from '@/lib/ui/narrative'

interface UseNarrativeRevealOptions {
  text: string
  enabled?: boolean
  instant?: boolean
  onComplete?: () => void
}

export function useNarrativeReveal({
  text,
  enabled = true,
  instant = false,
  onComplete,
}: UseNarrativeRevealOptions) {
  const chunks = useMemo(() => splitNarrativeChunks(text), [text])
  const [visibleCount, setVisibleCount] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const completedRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const complete = useCallback(() => {
    if (completedRef.current) {
      return
    }

    completedRef.current = true
    clearTimers()
    onComplete?.()
  }, [clearTimers, onComplete])

  const skip = useCallback(() => {
    clearTimers()
    setSkipped(true)
    setVisibleCount(chunks.length)
    complete()
  }, [chunks.length, clearTimers, complete])

  useEffect(() => {
    completedRef.current = false
    setSkipped(false)
    clearTimers()

    if (!enabled) {
      setVisibleCount(0)
      complete()
      return
    }

    if (instant || chunks.length === 0) {
      setVisibleCount(chunks.length)
      complete()
      return
    }

    if (chunks.length === 1) {
      setVisibleCount(1)
      timeoutRef.current = window.setTimeout(complete, 40)
      return clearTimers
    }

    setVisibleCount(1)
    let index = 1
    const delay = chunkRevealDelayMs(chunks.length)

    timerRef.current = window.setInterval(() => {
      index += 1

      if (index >= chunks.length) {
        if (timerRef.current != null) {
          window.clearInterval(timerRef.current)
          timerRef.current = null
        }

        setVisibleCount(chunks.length)
        timeoutRef.current = window.setTimeout(complete, 40)
        return
      }

      setVisibleCount(index)
    }, delay)

    return clearTimers
  }, [chunks, clearTimers, complete, enabled, instant, text])

  const isRevealing = enabled && !skipped && visibleCount < chunks.length

  return {
    chunks,
    visibleCount,
    isRevealing,
    skip,
  }
}
