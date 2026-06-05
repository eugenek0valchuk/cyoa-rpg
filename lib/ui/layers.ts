/** Shared stacking order for portaled overlays (low → high). */
export const zLayers = {
  npcEncounter: 'z-[80]',
  raidPrologue: 'z-[85]',
  keyChoice: 'z-[100]',
  diceRoll: 'z-[100]',
  gothicModal: 'z-[200]',
  artifactInspect: 'z-[220]',
  hubMerchant: 'z-[210]',
  loreCard: 'z-[210]',
  tooltip: 'z-[400]',
} as const
