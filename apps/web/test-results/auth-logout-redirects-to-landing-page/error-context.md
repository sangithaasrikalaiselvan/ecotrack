# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> logout redirects to landing page
- Location: src\tests\e2e\auth.spec.ts:53:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/"
Received: "http://localhost:3000/login"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    4 × unexpected value "http://localhost:3000/profile"
    10 × unexpected value "http://localhost:3000/login"

```

```yaml
- heading "EcoTrack AI" [level=1]
- heading "Sign In" [level=2]
- paragraph: Enter your email below to access your dashboard
- text: Email
- textbox "Email":
  - /placeholder: m@example.com
- text: Password
- textbox "Password"
- button "Sign In"
- text: Don't have an account?
- link "Create one":
  - /url: /register
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.beforeEach(async ({ page }) => {
  4  |   await page.route("**/api/v1/carbon/sample", async route => {
  5  |     await route.fulfill({
  6  |       status: 200,
  7  |       contentType: "application/json",
  8  |       body: JSON.stringify({
  9  |         total_kg: 120,
  10 |         green_score: 75,
  11 |         country_avg_kg: 180,
  12 |         equivalent: "Sample Data",
  13 |         breakdown_pct: {
  14 |           transport: 30,
  15 |           electricity: 30,
  16 |           food: 20,
  17 |           waste: 20
  18 |         }
  19 |       })
  20 |     });
  21 |   });
  22 | })
  23 | 
  24 | test('landing page loads correctly', async ({ page }) => {
  25 |   await page.goto('/')
  26 |   await expect(page.getByText('Track Your Carbon Footprint')).toBeVisible()
  27 |   await expect(page.getByText('Start Tracking Free')).toBeVisible()
  28 | })
  29 | 
  30 | test('register flow works', async ({ page }) => {
  31 |   await page.goto('/register')
  32 |   await page.fill('[name="name"]', 'Test User')
  33 |   await page.fill('[name="email"]', 'test@example.com')
  34 |   await page.fill('[name="password"]', 'Password123')
  35 |   await page.fill('[name="confirmPassword"]', 'Password123')
  36 |   await page.click('button[type="submit"]')
  37 |   await expect(page).toHaveURL('/dashboard')
  38 | })
  39 | 
  40 | test('login flow works', async ({ page }) => {
  41 |   await page.goto('/login')
  42 |   await page.fill('[name="email"]', 'any@example.com')
  43 |   await page.fill('[name="password"]', 'anypassword')
  44 |   await page.click('button[type="submit"]')
  45 |   await expect(page).toHaveURL('/dashboard')
  46 | })
  47 | 
  48 | test('unauthenticated user redirected from dashboard', async ({ page }) => {
  49 |   await page.goto('/dashboard')
  50 |   await expect(page).toHaveURL('/login')
  51 | })
  52 | 
  53 | test('logout redirects to landing page', async ({ page }) => {
  54 |   // Login first
  55 |   await page.goto('/login')
  56 |   await page.fill('[name="email"]', 'any@example.com')
  57 |   await page.fill('[name="password"]', 'anypassword')
  58 |   await page.click('button[type="submit"]')
  59 |   await expect(page).toHaveURL('/dashboard')
  60 |   
  61 |   // Then logout
  62 |   await page.goto('/profile')
  63 |   await page.waitForResponse(
  64 |     resp =>
  65 |       resp.url().includes("/carbon/sample") &&
  66 |       resp.status() === 200
  67 |   );
  68 |   await page.click('button:has-text("Log Out")')
> 69 |   await expect(page).toHaveURL('/')
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  70 | })
  71 | 
```