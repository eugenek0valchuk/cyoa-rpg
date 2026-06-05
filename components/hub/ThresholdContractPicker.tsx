'use client'

import type { ContractDef } from '@/locales/ru/contracts'
import { scribeUi } from '@/locales/ru/contracts'
import { t } from '@/lib/i18n'

interface Props {
  offered: ContractDef[]
  selectedContractId: string | null
  onSelect: (contractId: string | null) => void
  /** До первого извлечения — без витрины наград и зелёного блока */
  compact?: boolean
}

export function ThresholdContractPicker({
  offered,
  selectedContractId,
  onSelect,
  compact = false,
}: Props) {
  const { game } = t.ui

  if (offered.length === 0) {
    return null
  }

  if (compact) {
    const contract = offered[0]
    const selected = selectedContractId === contract.id

    return (
      <div className="border border-[#2b2320] bg-black/30 px-4 py-3">
        <p className="text-[12px] leading-relaxed text-[#85776a]">
          {game.thresholdContractsFirstHint}
        </p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => onSelect(selected ? null : contract.id)}
            className={`w-full border px-3 py-2.5 text-left transition ${
              selected
                ? 'border-[#5c3a3a] bg-[#140d0d]'
                : 'border-[#2b2320] bg-black/20 hover:border-[#4a3535]'
            }`}
          >
            <div className="font-cinzel text-sm text-[#d6cdc3]">
              {contract.title}
            </div>
            <p className="mt-1 text-[12px] text-[#9d8d82]">{contract.vow}</p>
          </button>
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
