import type { Artifact } from './game'

export type RaidOutcome = 'extracted' | 'failed'

export interface RaidSummary {
  outcome: RaidOutcome
  depth: number
  gainedArtifacts: Artifact[]
  lostArtifacts: Artifact[]
  newMarks: string[]
  sanityBefore: number
  sanityAfter: number
  roomLevelAfter: number
  bestDepthAfter: number
  totalExtractionsAfter: number
}
