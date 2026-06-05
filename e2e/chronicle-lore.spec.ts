import { expect, test } from '@playwright/test'

import { createVessel, dismissOnboardingTip, resetSaveSlot } from './helpers'

test.describe('Хроника: лор и полка', () => {
  test.beforeEach(async ({ page }) => {
    await resetSaveSlot(page)
    await createVessel(page, { name: 'E2E Lore', origin: 'witness' })
    await dismissOnboardingTip(page)
  })

  test('лор: чтение карточки снимает метку «Новая»', async ({ page }) => {
    await page.getByTestId('hub-chronicle').click()
    await page.getByTestId('chronicle-tab-lore').click()

    await expect(page.getByTestId('hub-lore-panel')).toBeVisible()
    await expect(page.getByTestId('lore-card-procession')).toBeVisible()

    await page.getByTestId('lore-card-procession').click()
    await expect(page.getByTestId('lore-card-modal')).toBeVisible()
    await expect(page.getByText('Шествие Пепла')).toBeVisible()

    await page.getByRole('button', { name: 'Закрыть' }).click()
    await expect(page.getByTestId('lore-card-modal')).toBeHidden()

    await page.getByRole('button', { name: 'Закрыть' }).first().click()

    await page.getByTestId('hub-chronicle').click()
    await page.getByTestId('chronicle-tab-lore').click()

    await expect(
      page.getByTestId('lore-card-procession').getByText('Новая'),
    ).toHaveCount(0)
  })
})
