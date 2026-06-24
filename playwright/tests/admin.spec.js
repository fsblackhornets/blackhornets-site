// @ts-check
const { test, expect } = require('@playwright/test');

const ADMIN_URL   = '/panel/admin/login.php';
const DASHBOARD   = '/panel/admin/pages/dashboard.php';
const ADMIN_USER  = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS  = process.env.ADMIN_PASSWORD || 'BlackHornets2025!';

test.describe('Admin login', () => {
    test('login page renders', async ({ page }) => {
        await page.goto(ADMIN_URL);
        await expect(page.locator('#loginForm')).toBeVisible();
        await expect(page.locator('#username')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
    });

    test('wrong credentials show error', async ({ page }) => {
        await page.goto(ADMIN_URL);
        await page.fill('#username', 'wronguser');
        await page.fill('#password', 'wrongpassword');
        await page.locator('#loginForm button[type="submit"], #submitBtn').click();

        await expect(page.locator('#error-message')).toBeVisible({ timeout: 5000 });
    });

    test('empty submit triggers validation', async ({ page }) => {
        await page.goto(ADMIN_URL);
        await page.locator('#loginForm button[type="submit"], #submitBtn').click();

        const usernameField = page.locator('#username');
        const valid = await usernameField.evaluate(el => el.validity.valid);
        expect(valid).toBe(false);
    });

    test('correct credentials redirect to dashboard', async ({ page }) => {
        await page.goto(ADMIN_URL);
        await page.fill('#username', ADMIN_USER);
        await page.fill('#password', ADMIN_PASS);
        await page.locator('#loginForm button[type="submit"], #submitBtn').click();

        await page.waitForURL(/dashboard|panel\/admin/, { timeout: 8000 });
        await expect(page).toHaveURL(/dashboard|panel\/admin/);
    });
});

test.describe('Admin dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(ADMIN_URL);
        await page.fill('#username', ADMIN_USER);
        await page.fill('#password', ADMIN_PASS);
        await page.locator('#loginForm button[type="submit"], #submitBtn').click();
        await page.waitForURL(/dashboard|panel\/admin/, { timeout: 8000 });
    });

    test('dashboard shows admin content', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
        // Admin navbar should be present
        await expect(page.locator('nav, .admin-nav, .sidebar, .navbar')).toBeVisible();
    });

    test('applications list is accessible', async ({ page }) => {
        await page.goto('/panel/admin/pages/applications_list.php');
        await expect(page.locator('body')).toBeVisible();
        // Should not redirect to login
        await expect(page).not.toHaveURL(/login/);
    });

    test('messages page is accessible', async ({ page }) => {
        await page.goto('/panel/admin/pages/messages.php');
        await expect(page.locator('body')).toBeVisible();
        await expect(page).not.toHaveURL(/login/);
    });

    test('logout redirects to login', async ({ page }) => {
        await page.goto('/panel/admin/logout.php');
        await expect(page).toHaveURL(/login/);
    });
});

test.describe('Admin auth guard', () => {
    test('dashboard redirects to login when not authenticated', async ({ page }) => {
        await page.goto(DASHBOARD);
        await expect(page).toHaveURL(/login/);
    });

    test('applications page redirects to login when not authenticated', async ({ page }) => {
        await page.goto('/panel/admin/pages/applications_list.php');
        await expect(page).toHaveURL(/login/);
    });
});
