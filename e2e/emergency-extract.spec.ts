import { expect, test } from '@playwright/test'

import {
  createVessel,
  emergencyExtractFromHeader,
  pickChoiceById,
  resetSaveSlot,
  returnFromRaidSummary,
  startRaidSession,
  waitForScene,
} from './helpers'

test.describe('Аварийное извлечение', () => {
  test('глубина без точки выхода: аварийный выход срабатывает', async ({
    page,
  }) => {
    await resetSaveSlot(page)
    await createVessel(page, { name: 'E2E Авария', origin: 'hollow' })

    await startRaidSession(page)

    await pickChoiceById(page, 'mouth')
    await waitForScene(page, 'mouth')
    await pickChoiceById(page, 'descent')
    await waitForScene(page, 'descent')

    const normalExtract = page.getByRole('button', { name: 'Извлечься' })
    await expect(normalExtract).toBeDisabled({ timeout: 10_000 })

    const emergency = page.getByTestId('emergency-extract')
    await expect(emergency).toBeEnabled({ timeout: 10_000 })

    await emergencyExtractFromHeader(page)
    await expect(page.getByText('Аварийный выход')).toBeVisible()
    await returnFromRaidSummary(page)

    await page.getByTestId('hub-chronicle').click()
    await page.getByTestId('chronicle-tab-chamber').click()
    await expect(page.getByTestId('chronicle-stat-extractions')).toContainText(
      '1',
    )
  })
})
