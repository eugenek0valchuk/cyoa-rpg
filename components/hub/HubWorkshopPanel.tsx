'use client'

import {
  canUpgradeBuilding,
  getBuildingLevel,
  getHubMaterials,
  HUB_BUILDINGS,
  upgradeBuilding,
} from '@/lib/game/hubWorkshop'
import { hubWorkshopUi } from '@/locales/ru/hubWorkshop'
import { t } from '@/lib/i18n'
import type { HubState } from '@/lib/types/hub'

interface HubWorkshopPanelProps {
  hub: HubState
  onUpgrade: (nextHub: HubState, message: string) => void
}

export function HubWorkshopPanel({ hub, onUpgrade }: HubWorkshopPanelProps) {
  const copy = t.hubWorkshop
  const materials = getHubMaterials(hub)

  return (
    <div className="space-y-6" data-testid="hub-workshop-panel">
      <div>
        <h3 className="font-cinzel text-xl uppercase tracking-[0.08em] text-[#efe5dc]">
          {copy.workshopTitle}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[#9d8d82]">
          {copy.workshopSubtitle}
        </p>
      </div>

      <section>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#75685f]">
          {copy.materialsTitle}
        </h4>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(copy.materialLabels).map(([id, label]) => (
            <li
              key={id}
              className="border border-[#2b2320] bg-black/30 px-3 py-2 text-center"
            >
              <div className="text-[10px] text-[#75685f]">{label}</div>
              <div className="font-cinzel mt-1 text-xl text-[#d6cdc3]">
                {materials[id] ?? 0}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#d46060]">
          {copy.buildingsTitle}
        </h4>
        {HUB_BUILDINGS.map((building) => {
          const level = getBuildingLevel(hub, building.id)
          const next = building.levels.find((entry) => entry.level === level + 1)
          const canUpgrade = canUpgradeBuilding(hub, building.id)

          return (
            <div
              key={building.id}
              className="border border-[#3b2f28] bg-[#14100e] px-4 py-3"
            >
              <div className="font-cinzel text-sm uppercase tracking-[0.06em] text-[#efe5dc]">
                {building.title}{' '}
                <span className="text-[#75685f]">
                  {level}/{building.maxLevel}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#9d8d82]">{building.description}</p>
              {next ? (
                <>
                  <p className="mt-2 text-[11px] text-[#8faa6a]">{next.effect}</p>
                  <p className="mt-1 text-[10px] text-[#75685f]">
                    {Object.entries(next.cost)
                      .map(
                        ([id, need]) =>
                          `${copy.materialLabels[id] ?? id} ×${need}`,
                      )
                      .join(' · ')}
                  </p>
                  <button
                    type="button"
                    disabled={!canUpgrade}
                    onClick={() => {
                      const upgraded = upgradeBuilding(hub, building.id)
                      if (!upgraded) {
                        return
                      }

                      onUpgrade(
                        upgraded,
                        `${copy.toastBuilding}: ${building.title}`,
                      )
                    }}
                    className="mt-3 border border-[#5c1f1f] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#d46060] transition hover:bg-[#160909] disabled:opacity-40"
                  >
                    {canUpgrade ? copy.upgrade : copy.needMaterials}
                  </button>
                </>
              ) : (
                <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-[#8faa6a]">
                  {copy.maxLevel}
                </p>
              )}
            </div>
          )
        })}
      </section>
    </div>
  )
}
