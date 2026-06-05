'use client'

import { motion } from 'framer-motion'

import { scribeUi } from '@/locales/ru/contracts'
import type { PendingContractClaim } from '@/lib/types/hub'

interface HubContractClaimProps {
  claim: PendingContractClaim
  onClaim: () => void
  claiming?: boolean
}

function renderEmphasis(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-[#d8c9be]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

export function HubContractClaim({
  claim,
  onClaim,
  claiming = false,
}: HubContractClaimProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 border-2 border-[#4a6a4a] bg-[#0a120a]/90 px-5 py-5"
    >
      <div className="text-[11px] uppercase tracking-[0.16em] text-[#6a8f6a]">
        {scribeUi.claimEyebrow}
      </div>
      <h3 className="font-cinzel mt-2 text-xl text-[#efe5dc]">{claim.title}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-[#9d8d82]">
        {renderEmphasis(scribeUi.claimGreeting)}
      </p>
      <p className="mt-3 text-[13px] text-[#85776a]">{claim.vow}</p>
      <p className="mt-4 text-[12px] uppercase tracking-[0.1em] text-[#6a8f6a]">
        {scribeUi.pickContract}: {claim.rewardSummary}
      </p>
      <button
        type="button"
        onClick={onClaim}
        disabled={claiming}
        className="font-cinzel mt-5 w-full border-2 border-[#5c1f1f] bg-[#160909] px-4 py-3 text-sm uppercase tracking-[0.14em] text-[#d46060] transition hover:bg-[#220d0d] disabled:opacity-40"
      >
        {claiming ? scribeUi.claiming : scribeUi.claimButton}
      </button>
    </motion.div>
  )
}
