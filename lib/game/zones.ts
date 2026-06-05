export type RaidZone = 'surface' | 'depth' | 'fracture' | 'collapse'

export function getRaidZone(depth: number, corruption = 0): RaidZone {
  if (corruption >= 75 || depth >= 9) {
    return 'collapse'
  }

  if (corruption >= 50 || depth >= 6) {
    return 'fracture'
  }

  if (depth >= 3) {
    return 'depth'
  }

  return 'surface'
}
