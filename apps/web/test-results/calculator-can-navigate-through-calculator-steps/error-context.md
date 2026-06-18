# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: calculator.spec.ts >> can navigate through calculator steps
- Location: src\tests\e2e\calculator.spec.ts:45:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByLabel('Monthly Electricity (kWh)')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByLabel('Monthly Electricity (kWh)')

```

```yaml
- complementary:
  - text: EcoTrack AI
  - navigation:
    - link "Dashboard":
      - /url: /dashboard
    - link "Calculator":
      - /url: /calculator
    - link "Insights":
      - /url: /insights
    - link "AI Coach":
      - /url: /coach
    - link "Leaderboard":
      - /url: /leaderboard
  - button "Sign Out"
- main:
  - text: Transport 2 Electricity 3 Food & Waste 4 Results
  - heading "Home Energy Use" [level=2]
  - text: Monthly Electricity (kWh)
  - spinbutton: "150"
  - paragraph: Check your electricity bill for this number
  - text: Estimated Emissions ≈ 123.0 kg CO₂ Country
  - combobox:
    - option "India" [selected]
    - option "United States"
    - option "United Kingdom"
    - option "Germany"
  - button "Back"
  - button "Next"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | test.beforeEach(async ({ page }) => {
  4  |   const sampleMock = {
  5  |     total_kg: 120,
  6  |     green_score: 75,
  7  |     country_avg_kg: 180,
  8  |     equivalent: "Sample Data",
  9  |     breakdown_pct: {
  10 |       transport: 30,
  11 |       electricity: 30,
  12 |       food: 20,
  13 |       waste: 20
  14 |     }
  15 |   };
  16 | 
  17 |   await page.route("**/api/v1/carbon/sample", async route => {
  18 |     await route.fulfill({
  19 |       status: 200,
  20 |       contentType: "application/json",
  21 |       body: JSON.stringify(sampleMock)
  22 |     });
  23 |   });
  24 | 
  25 |   await page.route("**/api/v1/carbon/calculate", async route => {
  26 |     await route.fulfill({
  27 |       status: 200,
  28 |       contentType: "application/json",
  29 |       body: JSON.stringify(sampleMock)
  30 |     });
  31 |   });
  32 | 
  33 |   await page.goto('/login')
  34 |   await page.fill('[name="email"]', 'test@example.com')
  35 |   await page.fill('[name="password"]', 'anypassword')
  36 |   await page.click('button[type="submit"]')
  37 |   await expect(page).toHaveURL('/dashboard')
  38 | })
  39 | 
  40 | test('calculator loads with step 1', async ({ page }) => {
  41 |   await page.goto('/calculator')
  42 |   await expect(page.getByRole('heading', { name: 'How do you get around?' })).toBeVisible()
  43 | })
  44 | 
  45 | test('can navigate through calculator steps', async ({ page }) => {
  46 |   await page.goto('/calculator')
  47 |   // Step 1: select vehicle
  48 |   await page.click('text=Petrol Car')
  49 |   await page.click('button:has-text("Next")')
  50 |   // Step 2: electricity
> 51 |   await expect(page.getByLabel('Monthly Electricity (kWh)')).toBeVisible()
     |                                                              ^ Error: expect(locator).toBeVisible() failed
  52 |   await page.fill('input[type="number"]', '150')
  53 |   await page.click('button:has-text("Next")')
  54 |   // Step 3: food & waste
  55 |   await expect(page.getByRole('heading', { name: 'Diet & Waste' })).toBeVisible()
  56 |   await page.click('text=Mixed')
  57 |   await page.click('text=Sometimes')
  58 |   await page.click('button:has-text("Calculate")')
  59 |   // Results
  60 |   await expect(page.getByText('kg CO₂')).toBeVisible({ timeout: 10000 })
  61 | })
  62 | 
  63 | test('dashboard shows carbon data', async ({ page }) => {
  64 |   await page.goto('/dashboard')
  65 | 
  66 |   await page.waitForResponse(
  67 |     resp =>
  68 |       resp.url().includes("/carbon/sample") &&
  69 |       resp.status() === 200
  70 |   );
  71 | 
  72 |   await expect(page.getByText(/kg CO₂/i).first()).toBeVisible()
  73 |   await expect(page.getByText('Green Score')).toBeVisible()
  74 | })
  75 | 
```