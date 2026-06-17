import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Login before each test
  await page.goto('/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'anypassword')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})

test('calculator loads with step 1', async ({ page }) => {
  await page.goto('/calculator')
  await expect(page.getByText('Transport')).toBeVisible()
})

test('can navigate through calculator steps', async ({ page }) => {
  await page.goto('/calculator')
  // Step 1: select vehicle
  await page.click('text=Petrol Car')
  await page.click('button:has-text("Next")')
  // Step 2: electricity
  await expect(page.getByText('Electricity')).toBeVisible()
  await page.fill('input[type="number"]', '150')
  await page.click('button:has-text("Next")')
  // Step 3: food & waste
  await expect(page.getByText('Food')).toBeVisible()
  await page.click('text=Mixed')
  await page.click('text=Sometimes')
  await page.click('button:has-text("Calculate")')
  // Results
  await expect(page.getByText('kg CO₂')).toBeVisible({ timeout: 10000 })
})

test('dashboard shows carbon data', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByText('kg CO₂')).toBeVisible({ timeout: 5000 })
  await expect(page.getByText('Green Score')).toBeVisible()
})
