export interface WorldState {
  currentRegion: string
  discoveredLocations: string[]
  activeThreats: string[]
  worldFlags: Record<string, boolean>
  recurringNpcIds: string[]
  usedThemes: string[]
}
