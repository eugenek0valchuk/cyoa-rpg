import { expect, test } from '@playwright/test'

import {
  createVessel,
  extractFromHeader,
  resetSaveSlot,
  returnFromRaidSummary,
  runMonasteryExtractionPath,
  startRaidSession,
} from './helpers'

test.describe('Четыре извлечения подряд', () => {
  test('кликами через UI: 4 спуска и хроника камеры', async ({ page }) => {
    await resetSaveSlot(page)
    await createVessel(page, { name: 'E2E Сосуд' })

    for (let i = 1; i <= 4; i += 1) {
      await startRaidSession(page)
      await runMonasteryExtractionPath(page)
      await extractFromHeader(page)
      await returnFromRaidSummary(page)
    }

    await page.getByTestId('hub-chronicle').click()
    await page.getByTestId('chronicle-tab-chamber').click()

    await expect(page.getByTestId('chronicle-stat-raids')).toContainText('4')
    await expect(page.getByTestId('chronicle-stat-extractions')).toContainText(
      '4',
    )

    await expect(page.getByText('Исходы спусков')).toBeVisible()
    await expect(page.getByText('Спуск 1 · глубина')).toBeVisible()
    await expect(page.getByText('Спуск 2 · глубина')).toBeVisible()
    await expect(page.getByText('Спуск 3 · глубина')).toBeVisible()
    await expect(page.getByText('Спуск 4 · глубина')).toBeVisible()
    await expect(page.getByText('Извлечение').first()).toBeVisible()
  })
})
