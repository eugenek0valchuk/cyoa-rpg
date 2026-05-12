import { getEnding } from './endings'

export function resolveEnding(sanity: number, corruption: number) {
  return getEnding(sanity, corruption)
}
