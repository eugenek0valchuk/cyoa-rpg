const DEFAULT_RETRIES = 2
const RETRY_DELAY_MS = 1000

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
}

export async function fetchWithRetry<T = unknown>(
  url: string,
  options: FetchOptions,
  retries = DEFAULT_RETRIES,
  delayMs = RETRY_DELAY_MS,
): Promise<T> {
  let lastError: unknown

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return response.json() as Promise<T>
    } catch (error) {
      lastError = error

      if (i === retries) {
        throw error
      }

      await delay(delayMs)
    }
  }

  throw lastError
}