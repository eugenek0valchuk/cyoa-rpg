export function createSceneId() {
  return `scene_${Math.random().toString(36).slice(2, 10)}`
}
