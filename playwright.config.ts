import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 90_000,
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',   // or "npm run start" if you build first
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});

