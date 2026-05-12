import type { Scene } from '../types/game'

interface StaticSceneParams {
  id: string
  title: string
  description: string
}

export function createStaticScene({
  id,
  title,
  description,
}: StaticSceneParams): Scene {
  return {
    id,
    title,
    description,
    options: [],
  }
}
