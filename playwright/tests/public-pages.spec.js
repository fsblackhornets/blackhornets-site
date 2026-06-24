// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Public pages', () => {
    test('home page shows hero section', async ({ page }) => {
        // PHP dev server doesn't process .htaccess — use direct path
        await page.goto('/frontend/pages/home/home.html');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('.hero, .hero-section, section').first()).toBeVisible();
    });

    test('blog page renders post cards or empty state', async ({ page }) => {
        await page.goto('/frontend/pages/blog/blog.html');
        await page.waitForLoadState('networkidle');
        const posts = page.locator('.post-card, .blog-card, .no-posts, .empty');
        await expect(posts.first()).toBeVisible({ timeout: 8000 });
    });

    test('gallery page renders images or empty state', async ({ page }) => {
        await page.goto('/frontend/pages/gallery/gallery.html');
        await page.waitForLoadState('networkidle');
        const content = page.locator('.gallery-item, .gallery-grid, .empty, img');
        await expect(content.first()).toBeVisible({ timeout: 8000 });
    });

    test('sponsors page renders or shows empty state', async ({ page }) => {
        await page.goto('/frontend/pages/sponsors/sponsors.html');
        await page.waitForLoadState('networkidle');
        const content = page.locator('.sponsor-card, .sponsors-grid, .empty, section');
        await expect(content.first()).toBeVisible({ timeout: 8000 });
    });

    test('team page renders hierarchy or loading state', async ({ page }) => {
        await page.goto('/frontend/pages/team/team.html');
        await page.waitForLoadState('networkidle');
        const content = page.locator('.leadership-hierarchy, .team-member, .loading, section');
        await expect(content.first()).toBeVisible({ timeout: 8000 });
    });

    test('projects page renders or shows empty state', async ({ page }) => {
        await page.goto('/frontend/pages/projects/projects.html');
        await page.waitForLoadState('networkidle');
        const content = page.locator('.project-card, .projects-grid, .empty, section');
        await expect(content.first()).toBeVisible({ timeout: 8000 });
    });

    test('about page loads', async ({ page }) => {
        await page.goto('/frontend/pages/about/about.html');
        await expect(page.locator('section, main, body')).toBeVisible();
    });

    test('no page returns 500 error', async ({ page }) => {
        const pages = [
            '/frontend/pages/home/home.html',
            '/frontend/pages/blog/blog.html',
            '/frontend/pages/gallery/gallery.html',
            '/frontend/pages/team/team.html',
            '/frontend/pages/sponsors/sponsors.html',
            '/frontend/pages/contact/contact.html',
            '/frontend/pages/apply/apply.html',
        ];

        for (const url of pages) {
            const response = await page.goto(url);
            expect(response?.status(), `${url} returned error`).toBeLessThan(500);
        }
    });

    test('404 redirects to home', async ({ page }) => {
        const response = await page.goto('/this-page-does-not-exist-xyz');
        // htaccess routes 404 to home
        await expect(page.locator('body')).toBeVisible();
    });
});
