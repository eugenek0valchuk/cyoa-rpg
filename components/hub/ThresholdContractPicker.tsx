'use client'

import type { ContractDef } from '@/locales/ru/contracts'
import { scribeUi } from '@/locales/ru/contracts'
import { t } from '@/lib/i18n'

interface Props {
  offered: ContractDef[]
  selectedContractId: string | null
  onSelect: (contractId: string | null) => void
}

export function ThresholdContractPicker({
  offered,
  selectedContractId,
  onSelect,
}: Props) {
  const { game } = t.ui

  if (offered.length === 0) {
    return null
  }

  return (
    <div className="border border-[#2a3d2a] bg-[#0a120a]/60 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.12em] text-[#6a8f6a]">
        {game.thresholdContractsTitle}
      </div>
      <p className="mt-1 text-[12px] leading-relaxed text-[#85776a]">
        {game.thresholdContractsHint}
      </p>

      <div className="mt-3 space-y-2">
        {offered.map((contract) => {
          const selected = selectedContractId === contract.id

          return (
            <button
              key={contract.id}
              type="button"
              onClick={() => onSelect(selected ? null : contract.id)}
              className={`w-full border px-3 py-3 text-left transition ${
                selected
                  ? 'border-[#8e1f1f] bg-[#160909]'
                  : 'border-[#2b2320] bg-black/30 hover:border-[#5c1f1f]'
              }`}
            >
              <div className="font-cinzel text-base text-[#efe5dc]">
                {contract.title}
              </div>
              <p className="mt-1 text-[13px] text-[#9d8d82]">{contract.vow}</p>
              <p className="mt-1 text-[11px] text-[#6a8f6a]">
                {contract.reward}
              </p>
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`w-full border px-3 py-2 text-left text-[12px] uppercase tracking-[0.1em] transition ${
            selectedContractId === null
              ? 'border-[#3a3a3a] text-[#9d8d82]'
              : 'border-[#241919] text-[#75685f] hover:text-[#9d8d82]'
          }`}
        >
          {scribeUi.noContract}
        </button>
      </div>
    </div>
  )
}
