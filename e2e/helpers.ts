import { expect, type Page } from '@playwright/test'

import type { Origin } from '@/lib/types/game'

export const DEFAULT_SLOT = 0

export async function resetSaveSlot(page: Page) {
  await page.goto('/')
  await page.evaluate(async () => {
    localStorage.clear()
    sessionStorage.clear()
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase('cyoa-rpg-saves')
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
      req.onblocked = () => resolve()
    })
  })
}

export async function createVessel(
  page: Page,
  options: {
    name: string
    origin?: Origin
    slot?: number
  },
) {
  const slot = options.slot ?? DEFAULT_SLOT

  await page.goto(`/editor?slot=${slot}`)
  await page.waitForLoadState('domcontentloaded')

  if (options.origin) {
    await page.getByTestId(`editor-origin-${options.origin}`).click()
  }

  const nameInput = page.getByTestId('editor-vessel-name')
  await nameInput.click()
  await nameInput.fill('')
  await nameInput.pressSequentially(options.name, { delay: 15 })
  await expect(page.getByTestId('editor-submit')).toBeEnabled({ timeout: 10_000 })
  await page.getByTestId('editor-submit').click()
  await page.waitForURL('**/hub')
}

export async function beginRaid(page: Page) {
  await page.getByTestId('hub-threshold').click()
  await expect(page.getByTestId('hub-begin-raid')).toBeVisible()
  await page.getByTestId('hub-begin-raid').click()
  await page.waitForURL('**/game')
}

export async function skipPrologue(page: Page) {
  const skip = page.getByRole('button', { name: 'Пропустить' })

  if (await skip.isVisible().catch(() => false)) {
    await skip.click()
    await expect(skip).toBeHidden({ timeout: 10_000 })
  }
}

export async function dismissOnboardingTip(page: Page) {
  const hideTip = page.getByRole('button', { name: 'Скрыть подсказку' })

  if (await hideTip.isVisible().catch(() => false)) {
    await hideTip.click()
  }

  const journalBanner = page.getByRole('button', {
    name: 'В дневник добавлена запись — открой хронику',
  })

  if (await journalBanner.isVisible().catch(() => false)) {
    await journalBanner.click()
  }
}

export async function waitForScene(page: Page, sceneId: string) {
  await expect(page.getByTestId(`scene-${sceneId}`)).toBeVisible({
    timeout: 30_000,
  })
}

export async function skipNpcModal(page: Page) {
  const skip = page.getByTestId('npc-encounter-skip')

  if (!(await skip.isVisible().catch(() => false))) {
    return
  }

  await skip.click()
  await expect(skip).toBeHidden({ timeout: 15_000 })
}

export async function pickChoiceById(page: Page, choiceId: string) {
  await skipNpcModal(page)

  const choice = page.getByTestId(`choice-${choiceId}`)
  await expect(choice).toBeVisible({ timeout: 30_000 })
  await expect(choice).toBeEnabled({ timeout: 15_000 })
  await choice.click()

  const confirm = page.getByRole('button', { name: 'Принять путь' })
  if (await confirm.isVisible().catch(() => false)) {
    await confirm.click()
    await expect(confirm).toBeHidden({ timeout: 10_000 })
  }
}

export async function continueZoneBridgeIfNeeded(page: Page) {
  const depthBridge = page.getByTestId('scene-zone_bridge_surface_depth')

  if (await depthBridge.isVisible().catch(() => false)) {
    await pickChoiceById(page, 'zone_bridge_continue')
  }
}

/** Монастырь → колокол → двор: извлечение с глубины ≥2. */
export async function runMonasteryExtractionPath(page: Page) {
  await pickChoiceById(page, 'monastery')
  await waitForScene(page, 'monastery')
  await pickChoiceById(page, 'bell')
  await waitForScene(page, 'bell')
  await pickChoiceById(page, 'exit_monastery')

  const depthBridge = page.getByTestId('scene-zone_bridge_surface_depth')
  const exitScene = page.getByTestId('scene-exit_monastery')
  await expect(depthBridge.or(exitScene)).toBeVisible({ timeout: 30_000 })

  await continueZoneBridgeIfNeeded(page)
  await waitForScene(page, 'exit_monastery')
}

export async function extractFromHeader(page: Page) {
  const extractHeader = page.getByRole('button', { name: 'Извлечься' })
  await expect(extractHeader).toBeEnabled({ timeout: 15_000 })
  await extractHeader.click()
  await page.waitForURL('**/raid-summary')
}

export async function emergencyExtractFromHeader(page: Page) {
  const emergency = page.getByTestId('emergency-extract')
  await expect(emergency).toBeEnabled({ timeout: 15_000 })
  await emergency.click()
  await page.getByRole('button', { name: 'Вырваться' }).click()
  await page.waitForURL('**/raid-summary')
}

export async function returnFromRaidSummary(page: Page) {
  await page.getByTestId('raid-summary-return').click()
  await page.waitForURL('**/hub')
}

export async function startRaidSession(page: Page) {
  await beginRaid(page)
  await waitForScene(page, 'start')
  await skipPrologue(page)
  await dismissOnboardingTip(page)
}
