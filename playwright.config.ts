import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright settings for the Sauce Demo test suite.
 * Same tests run on 3 "devices": desktop Chrome, iPhone (Safari engine) and Android (Chrome).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // stop a stray test.only from reaching CI
  retries: process.env.CI ? 1 : 0,       // one retry on CI only, so flaky tests are visible locally
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',        // the site uses data-test="..." on its elements
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',          // full step-by-step trace when something fails
  },

  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'iPhone 15',      use: { ...devices['iPhone 15'] } },
    { name: 'Android Pixel 7', use: { ...devices['Pixel 7'] } },
  ],
});
