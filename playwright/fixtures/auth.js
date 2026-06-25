// @ts-check
const { expect } = require('@playwright/test');

const ADMIN_LOGIN   = '/panel/admin/login.php';
const MANAGER_LOGIN = '/panel/manager/login.php';

const ADMIN_USER   = process.env.ADMIN_USERNAME   || 'admin';
const ADMIN_PASS   = process.env.ADMIN_PASSWORD   || 'BlackHornets2025!';
const MANAGER_USER = process.env.MANAGER_USERNAME || 'manager';
const MANAGER_PASS = process.env.MANAGER_PASSWORD || 'Manager123!';

async function loginAsAdmin(page) {
    await page.goto(ADMIN_LOGIN);
    await page.fill('#username', ADMIN_USER);
    await page.fill('#password', ADMIN_PASS);
    await page.locator('#submitBtn, button[type="submit"]').click();
    await page.waitForURL(/dashboard|panel\/admin\/pages/, { timeout: 8000 });
}

async function loginAsManager(page) {
    await page.goto(MANAGER_LOGIN);
    // Manager login may share the admin login UI
    const hasLoginForm = await page.locator('#loginForm').isVisible().catch(() => false);
    if (hasLoginForm) {
        await page.fill('#username', MANAGER_USER);
        await page.fill('#password', MANAGER_PASS);
        await page.locator('#submitBtn, button[type="submit"]').click();
        await page.waitForURL(/dashboard|panel\/manager/, { timeout: 8000 });
    }
}

async function logout(page) {
    await page.goto('/panel/admin/logout.php');
    await expect(page).toHaveURL(/login/);
}

module.exports = {
    ADMIN_LOGIN,
    MANAGER_LOGIN,
    loginAsAdmin,
    loginAsManager,
    logout,
};
