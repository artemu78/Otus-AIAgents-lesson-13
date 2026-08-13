/**
 * Playwright config for running against an already-running dev server.
 * Use when port 5173 is already occupied (e.g., Vite started separately).
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
});
