import { test, expect } from '@playwright/test';

test('homepage loads and displays hero section', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Volkern Properties/);

    // Check for hero headline
    const heroHeading = page.locator('h1', { hasText: 'Encuentra el hogar' });
    await expect(heroHeading).toBeVisible();

    // Check if featured section exists
    const featuredHeading = page.locator('h2', { hasText: 'Propiedades Destacadas' });
    await expect(featuredHeading).toBeVisible();
});
