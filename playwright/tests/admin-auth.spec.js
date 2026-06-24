// @ts-check
const { test, expect } = require('@playwright/test');
const { ADMIN_LOGIN, loginAsAdmin, logout } = require('../fixtures/auth');

const PROTECTED_PAGES = [
    '/panel/admin/pages/dashboard.php',
    '/panel/admin/pages/applications_list.php',
    '/panel/admin/pages/messages.php',
    '/panel/admin/pages/posts.php',
    '/panel/admin/pages/manage_members.php',
    '/panel/admin/pages/manage-gallery.php',
    '/panel/admin/pages/manage-projects.php',
    '/panel/admin/pages/manage-sponsors.php',
    '/panel/admin/pages/content-requests.php',
    '/panel/admin/pages/team_dashboard.php',
    '/panel/admin/pages/add_user.php',
    '/panel/admin/pages/add-edit-post.php',
    '/panel/admin/pages/add-edit-project.php',
    '/panel/admin/pages/add-edit-sponsor.php',
    '/panel/admin/pages/edit_profile.php',
    '/panel/admin/change_password.php',
];

test.describe('Admin — login page', () => {
    test('renders login form', async ({ page }) => {
        await page.goto(ADMIN_LOGIN);
        await expect(page.locator('#loginForm')).toBeVisible();
        await expect(page.locator('#username')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.locator('#submitBtn')).toBeVisible();
    });

    test('empty submit triggers HTML5 validation', async ({ page }) => {
        await page.goto(ADMIN_LOGIN);
        await page.locator('#submitBtn').click();
        const valid = await page.locator('#username').evaluate(el => /** @type {HTMLInputElement} */ (el).validity.valid);
        expect(valid).toBe(false);
    });

    test('wrong credentials show error message', async ({ page }) => {
        await page.goto(ADMIN_LOGIN);
        await page.fill('#username', 'notauser');
        await page.fill('#password', 'notapassword');
        await page.locator('#submitBtn').click();
        await expect(page.locator('#error-message')).toBeVisible({ timeout: 6000 });
    });

    test('correct credentials redirect to dashboard', async ({ page }) => {
        await loginAsAdmin(page);
        await expect(page).toHaveURL(/dashboard|panel\/admin\/pages/);
    });
});

test.describe('Admin — auth guards (unauthenticated)', () => {
    for (const url of PROTECTED_PAGES) {
        test(`${url} redirects to login`, async ({ page }) => {
            await page.goto(url);
            await expect(page).toHaveURL(/login/);
        });
    }
});

test.describe('Admin — logout', () => {
    test('logout clears session and redirects to login', async ({ page }) => {
        await loginAsAdmin(page);
        await logout(page);
        await expect(page).toHaveURL(/login/);
    });

    test('cannot access dashboard after logout', async ({ page }) => {
        await loginAsAdmin(page);
        await logout(page);
        await page.goto('/panel/admin/pages/dashboard.php');
        await expect(page).toHaveURL(/login/);
    });
});
