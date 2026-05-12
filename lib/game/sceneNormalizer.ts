export function normalizeEffects(effects: any, ownedArtifacts: Set<string>) {
  const normalized = {
    ...effects,
  }

  if (normalized.addArtifact && ownedArtifacts.has(normalized.addArtifact)) {
    delete normalized.addArtifact
  }

  if (normalized.addArtifact && typeof normalized.addArtifact !== 'string') {
    delete normalized.addArtifact
  }

  if (normalized.addFlag && typeof normalized.addFlag !== 'string') {
    delete normalized.addFlag
  }

  if (normalized.sanity && typeof normalized.sanity !== 'number') {
    delete normalized.sanity
  }

  if (normalized.corruption && typeof normalized.corruption !== 'number') {
    delete normalized.corruption
  }

  return normalized
}
