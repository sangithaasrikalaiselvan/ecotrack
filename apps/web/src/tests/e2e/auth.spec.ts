import { test, expect } from '@playwright/test'

test('landing page loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Track Your Carbon Footprint')).toBeVisible()
  await expect(page.getByText('Start Tracking Free')).toBeVisible()
})

test('register flow works', async ({ page }) => {
  await page.goto('/register')
  await page.fill('[name="name"]', 'Test User')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'Password123')
  await page.fill('[name="confirmPassword"]', 'Password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})

test('login flow works', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'any@example.com')
  await page.fill('[name="password"]', 'anypassword')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})

test('unauthenticated user redirected from dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
})

test('logout redirects to landing page', async ({ page }) => {
  // Login first
  await page.goto('/login')
  await page.fill('[name="email"]', 'any@example.com')
  await page.fill('[name="password"]', 'anypassword')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
  
  // Then logout
  await page.goto('/profile')
  await page.click('button:has-text("Log Out")')
  await expect(page).toHaveURL('/')
})
