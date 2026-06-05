import { expect, test, type Page } from '@playwright/test'

/**
 * Сквозной UI-тест: 4 спуска с извлечением через клики (камера → порог → игра → итог).
 * Маршрут: монастырь → колокол → бежать из монастыря → извлечься.
 * Смотреть в браузере: npm run test:e2e:headed
 */

const SLOT = 0
const VESSEL_NAME = 'E2E Сосуд'

async function waitForScene(page: Page, sceneId: string) {
  await expect(page.getByTestId(`scene-${sceneId}`)).toBeVisible({ timeout: 30_000 })
}

/** Очистить IndexedDB и localStorage перед чистым прогоном. */
async function resetSaveSlot(page: Page) {
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

async function pickChoiceById(page: Page, choiceId: string) {
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

/** Один полный цикл: порог → спуск → извлечение → возврат в камеру. */
async function runExtractionRaid(page: Page) {
  await page.getByTestId('hub-threshold').click()
  await expect(page.getByTestId('hub-begin-raid')).toBeVisible()
  await page.getByTestId('hub-begin-raid').click()

  await page.waitForURL('**/game')
  await waitForScene(page, 'start')

  const skipPrologue = page.getByRole('button', { name: 'Пропустить' })
  if (await skipPrologue.isVisible().catch(() => false)) {
    await skipPrologue.click()
  }

  const hideTip = page.getByRole('button', { name: 'Скрыть подсказку' })
  if (await hideTip.isVisible().catch(() => false)) {
    await hideTip.click()
  }

  await pickChoiceById(page, 'monastery')
  await waitForScene(page, 'monastery')
  await pickChoiceById(page, 'bell')
  await waitForScene(page, 'bell')
  await pickChoiceById(page, 'exit_monastery')

  const depthBridge = page.getByTestId('scene-zone_bridge_surface_depth')
  const exitScene = page.getByTestId('scene-exit_monastery')
  await expect(depthBridge.or(exitScene)).toBeVisible({ timeout: 30_000 })

  if (await depthBridge.isVisible()) {
    await pickChoiceById(page, 'zone_bridge_continue')
  }

  await waitForScene(page, 'exit_monastery')

  const extractHeader = page.getByRole('button', { name: 'Извлечься' })
  await expect(extractHeader).toBeEnabled({ timeout: 15_000 })
  await extractHeader.click()

  await page.waitForURL('**/raid-summary')
  await page.getByTestId('raid-summary-return').click()
  await page.waitForURL('**/hub')
}

test.describe('Четыре извлечения подряд', () => {
  test('кликами через UI: 4 спуска и хроника камеры', async ({ page }) => {
    await resetSaveSlot(page)

    await page.goto(`/editor?slot=${SLOT}`)
    await page.waitForLoadState('domcontentloaded')

    const nameInput = page.getByTestId('editor-vessel-name')
    await nameInput.click()
    await nameInput.pressSequentially(VESSEL_NAME, { delay: 20 })
    await expect(page.getByTestId('editor-submit')).toBeEnabled({ timeout: 10_000 })
    await page.getByTestId('editor-submit').click()
    await page.waitForURL('**/hub')

    for (let i = 1; i <= 4; i += 1) {
      await runExtractionRaid(page)
    }

    await page.getByTestId('hub-chronicle').click()
    await page.getByTestId('chronicle-tab-chamber').click()

    await expect(page.getByTestId('chronicle-stat-raids')).toContainText('4')
    await expect(page.getByTestId('chronicle-stat-extractions')).toContainText('4')

    await expect(page.getByText('Исходы спусков')).toBeVisible()
    await expect(page.getByText('Спуск 1 · глубина')).toBeVisible()
    await expect(page.getByText('Спуск 2 · глубина')).toBeVisible()
    await expect(page.getByText('Спуск 3 · глубина')).toBeVisible()
    await expect(page.getByText('Спуск 4 · глубина')).toBeVisible()
    await expect(page.getByText('Извлечение').first()).toBeVisible()
  })
})
