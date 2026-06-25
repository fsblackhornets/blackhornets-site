// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../fixtures/auth');

test.describe('Admin — manage members', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage_members.php');
    });

    test('page loads with member list or empty state', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.locator('.member-card, .empty, .no-members').first()).toBeVisible({ timeout: 8000 });
    });

    test('edit member link is present', async ({ page }) => {
        const editBtn = page.locator('.edit-member, a[href*="edit_member"]').first();
        const hasMembers = await editBtn.isVisible().catch(() => false);
        if (hasMembers) {
            await expect(editBtn).toBeVisible();
        }
    });

    test('toggle status link has CSRF token', async ({ page }) => {
        const toggleBtn = page.locator('.toggle-status-btn').first();
        const hasMembers = await toggleBtn.isVisible().catch(() => false);
        if (hasMembers) {
            const href = await toggleBtn.getAttribute('href') ?? '';
            expect(href).toContain('csrf_token');
        }
    });

    test('delete button has CSRF token', async ({ page }) => {
        const deleteBtn = page.locator('.delete-btn').first();
        const hasMembers = await deleteBtn.isVisible().catch(() => false);
        if (hasMembers) {
            const href = await deleteBtn.getAttribute('href') ?? '';
            expect(href).toContain('csrf_token');
        }
    });
});

test.describe('Admin — add user form', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add_user.php');
    });

    test('form is present', async ({ page }) => {
        await expect(page.locator('form')).toBeVisible();
    });

    test('required fields are present', async ({ page }) => {
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#full_name')).toBeVisible();
        // username/password are shown only when admin role is selected
        expect(await page.locator('#username').count()).toBeGreaterThan(0);
        expect(await page.locator('#password').count()).toBeGreaterThan(0);
    });

    test('submit empty form shows validation', async ({ page }) => {
        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        const emailValid = await page.locator('#email').evaluate(el => /** @type {HTMLInputElement} */ (el).validity.valid).catch(() => true);
        expect(emailValid).toBe(false);
    });

    test('invalid email shows validation error', async ({ page }) => {
        await page.fill('#email', 'not-valid');
        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        const valid = await page.locator('#email').evaluate(el => /** @type {HTMLInputElement} */ (el).validity.valid);
        expect(valid).toBe(false);
    });
});

test.describe('Admin — edit member', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('edit_member without id shows error or redirects', async ({ page }) => {
        await page.goto('/panel/admin/pages/edit_member.php');
        await expect(page.locator('body')).toBeVisible();
    });

    test('edit_member with valid id shows form', async ({ page }) => {
        await page.goto('/panel/admin/pages/manage_members.php');
        const editBtn = page.locator('.edit-member, a[href*="edit_member"]').first();
        const hasMembers = await editBtn.isVisible().catch(() => false);

        if (hasMembers) {
            await editBtn.click();
            await expect(page).toHaveURL(/edit_member/);
            await expect(page.locator('form')).toBeVisible();
        }
    });
});

test.describe('Admin — edit profile', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/edit_profile.php');
    });

    test('profile form is visible', async ({ page }) => {
        await expect(page.locator('.profile-form, form')).toBeVisible();
    });

    test('profile picture upload field present', async ({ page }) => {
        // file inputs are hidden by CSS — check existence not visibility
        expect(await page.locator('#profile_picture').count()).toBeGreaterThan(0);
    });

    test('full_name field is visible (readonly for admin)', async ({ page }) => {
        await expect(page.locator('[name="full_name"]')).toBeVisible();
    });
});

test.describe('Admin — change password', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/change_password.php');
    });

    test('change password page loads', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
        await expect(page).not.toHaveURL(/login/);
    });
});
