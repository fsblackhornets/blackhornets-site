// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
    test('home page loads', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Black Hornets/i);
    });

    test('navbar is visible', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('nav, header')).toBeVisible();
    });

    test('logo links to home', async ({ page }) => {
        await page.goto('/frontend/pages/team/team.html');
        await page.locator('header a[href*="home"]').first().click();
        await expect(page).toHaveURL(/home\.html|\/$/);
    });

    test('navigates to team page', async ({ page }) => {
        await page.goto('/');
        await page.goto('/frontend/pages/team/team.html');
        await expect(page).toHaveTitle(/Team|Black Hornets/i);
    });

    test('navigates to blog page', async ({ page }) => {
        await page.goto('/frontend/pages/blog/blog.html');
        await expect(page).toHaveTitle(/Blog|Black Hornets/i);
    });

    test('navigates to gallery page', async ({ page }) => {
        await page.goto('/frontend/pages/gallery/gallery.html');
        await expect(page).toHaveTitle(/Gallery|Black Hornets/i);
    });

    test('navigates to sponsors page', async ({ page }) => {
        await page.goto('/frontend/pages/sponsors/sponsors.html');
        await expect(page).toHaveTitle(/Sponsor|Black Hornets/i);
    });

    test('navigates to contact page', async ({ page }) => {
        await page.goto('/frontend/pages/contact/contact.html');
        await expect(page).toHaveTitle(/Contact|Black Hornets/i);
    });

    test('navigates to apply page', async ({ page }) => {
        await page.goto('/frontend/pages/apply/apply.html');
        await expect(page).toHaveTitle(/Apply|Join|Black Hornets/i);
    });

    test('apply button visible in navbar', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.apply-btn')).toBeVisible();
    });
});
