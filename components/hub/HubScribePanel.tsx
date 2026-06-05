'use client'

import type { ContractDef } from '@/locales/ru/contracts'
import { scribeUi } from '@/locales/ru/contracts'
import type { HubState } from '@/lib/types/hub'

interface HubScribePanelProps {
  hub: HubState
  offered: ContractDef[]
  selectedContractId: string | null
  onSelect: (contractId: string | null) => void
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

function getGreeting(hub: HubState): string {
  if (hub.roomMarks.includes('failure_stain')) {
    return scribeUi.greetingStain
  }

  if (
    hub.journalEntries.includes('npc_breathless') &&
    !hub.journalEntries.includes('npc_synod')
  ) {
    return scribeUi.greetingSynod
  }

  return scribeUi.greeting
}

export function HubScribePanel({
  hub,
  offered,
  selectedContractId,
  onSelect,
}: HubScribePanelProps) {
  return (
    <div className="space-y-5">
      <p className="text-[15px] leading-8 text-[#b8a99e]">
        {renderEmphasis(getGreeting(hub))}
      </p>

      <div className="space-y-3">
        {offered.map((contract) => {
          const selected = selectedContractId === contract.id

          return (
            <button
              key={contract.id}
              type="button"
              onClick={() => onSelect(selected ? null : contract.id)}
              className={`w-full border px-4 py-4 text-left transition ${
                selected
                  ? 'border-[#8e1f1f] bg-[#160909]'
                  : 'border-[#2b2320] bg-black/30 hover:border-[#5c1f1f]'
              }`}
            >
              <div className="font-cinzel text-lg text-[#efe5dc]">
                {contract.title}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-[#9d8d82]">
                {contract.vow}
              </p>
              <p className="mt-2 text-[12px] text-[#6a8f6a]">
                {scribeUi.pickContract}: {contract.reward}
              </p>
            </button>
          )
        })}

        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`w-full border px-4 py-3 text-left text-[13px] uppercase tracking-[0.12em] transition ${
            selectedContractId === null
              ? 'border-[#4a5c4a] bg-[#0a120a] text-[#9d8d82]'
              : 'border-[#2b2320] text-[#75685f] hover:border-[#4a5c4a]'
          }`}
        >
          {scribeUi.noContract}
        </button>
      </div>
    </div>
  )
}
