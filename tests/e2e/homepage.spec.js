import { expect, test } from '@playwright/test';

test('главная страница соответствует эталонному снимку', async ({ page }) => {
  await page.route('**/api/articles', (route) =>
    route.fulfill({ json: [] }),
  );
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Knowledge Graph News' })).toBeVisible();
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});
