import { test, expect } from '@playwright/test';

test('homepage has correct title and key elements', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AuthorStack - Your Book Business Dashboard/);

  // Check for the main heading text
  await expect(page.getByText('Turn your author journey into a well-oiled publishing engine')).toBeVisible();

  // Check for the main navigation buttons
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start Free Trial' })).toBeVisible();
});