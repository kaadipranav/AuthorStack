import { test, expect } from '@playwright/test';

test('features and pricing sections are accessible', async ({ page }) => {
  await page.goto('/');

  // Scroll to features section
  await page.locator('#features').scrollIntoViewIfNeeded();
  await expect(page.locator('#features')).toBeVisible();

  // Check for feature cards
  const featureCards = page.locator('[data-testid="feature-card"]');
  if ((await featureCards.count()) > 0) {
    await expect(featureCards.first()).toBeVisible();
  }

  // Scroll to pricing section
  await page.locator('#pricing').scrollIntoViewIfNeeded();
  await expect(page.locator('#pricing')).toBeVisible();

  // Check for pricing cards
  const pricingCards = page.locator('[data-testid="pricing-card"]');
  if ((await pricingCards.count()) > 0) {
    await expect(pricingCards.first()).toBeVisible();
  }
});