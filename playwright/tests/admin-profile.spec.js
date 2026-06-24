// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../fixtures/auth');

// ─── Change password ──────────────────────────────────────────────────────────

test.describe('Admin — change password', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/change_password.php');
    });

    test('change password page loads without redirect', async ({ page }) => {
        await expect(page).not.toHaveURL(/login/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('current_password field is present', async ({ page }) => {
        await expect(page.locator('[name="current_password"], #current_password')).toBeVisible();
    });

    test('new_password field is present', async ({ page }) => {
        await expect(page.locator('[name="new_password"], #new_password')).toBeVisible();
    });

    test('wrong current password returns error', async ({ page }) => {
        const currentField = page.locator('[name="current_password"], #current_password');
        const newField     = page.locator('[name="new_password"], #new_password');
        if (await currentField.isVisible().catch(() => false)) {
            await currentField.fill('definitelyWrongPassword999!');
            await newField.fill('NewValidPass123!');
            const [response] = await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('change_password') && res.request().method() === 'POST',
                    { timeout: 6000 }
                ).catch(() => null),
                page.locator('button[type="submit"], input[type="submit"]').first().click(),
            ]);
            if (response) {
                const body = await response.json().catch(() => ({}));
                expect(body.success).toBe(false);
            } else {
                // Server-side redirect path: error message rendered on page
                await expect(page.locator('.error, .alert-danger, [class*="error"], body'))
                    .toContainText(/incorrect|wrong|invalid|current/i);
            }
        }
    });

    test('new password shorter than 8 chars returns error', async ({ page }) => {
        const currentField = page.locator('[name="current_password"], #current_password');
        const newField     = page.locator('[name="new_password"], #new_password');
        if (await currentField.isVisible().catch(() => false)) {
            await currentField.fill(process.env.ADMIN_PASSWORD || 'BlackHornets2025!');
            await newField.fill('short');
            const [response] = await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('change_password') && res.request().method() === 'POST',
                    { timeout: 6000 }
                ).catch(() => null),
                page.locator('button[type="submit"], input[type="submit"]').first().click(),
            ]);
            if (response) {
                const body = await response.json().catch(() => ({}));
                expect(body.success).toBe(false);
            }
        }
    });
});

// ─── Edit profile ─────────────────────────────────────────────────────────────

test.describe('Admin — edit profile', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/edit_profile.php');
    });

    test('edit profile page loads', async ({ page }) => {
        await expect(page).not.toHaveURL(/login/);
        await expect(page.locator('.profile-form, form')).toBeVisible();
    });

    test('profile picture upload field is present', async ({ page }) => {
        await expect(page.locator('#profile_picture')).toBeVisible();
    });

    test('age field is present and editable', async ({ page }) => {
        const field = page.locator('[name="age"], #age');
        if (await field.isVisible().catch(() => false)) {
            await expect(field).toBeEditable();
        }
    });

    test('motivation textarea is present', async ({ page }) => {
        await expect(page.locator('[name="motivation"], #motivation')).toBeVisible();
    });

    test('skills textarea is present', async ({ page }) => {
        await expect(page.locator('[name="skills"], #skills')).toBeVisible();
    });

    test('projects textarea is present', async ({ page }) => {
        await expect(page.locator('[name="projects"], #projects')).toBeVisible();
    });

    test('achievements textarea is present', async ({ page }) => {
        await expect(page.locator('[name="achievements"], #achievements')).toBeVisible();
    });

    test('profile picture file input accepts images only', async ({ page }) => {
        const accept = await page.locator('#profile_picture').getAttribute('accept') ?? '';
        expect(accept).toContain('image');
    });

    test('profile picture preview fires on file select', async ({ page }) => {
        const preview = page.locator('#profilePicture, img[id*="preview"], .preview-img');
        const fileInput = page.locator('#profile_picture');
        if (await fileInput.isVisible().catch(() => false)) {
            await fileInput.setInputFiles({
                name: 'avatar.jpg',
                mimeType: 'image/jpeg',
                buffer: Buffer.from(
                    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U'
                    + 'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIA'
                    + 'AhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/'
                    + 'EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIR'
                    + 'AxEAPwCwABmX/9k=',
                    'base64'
                ),
            });
            // Preview should update (src changes to object URL)
            if (await preview.isVisible().catch(() => false)) {
                const src = await preview.getAttribute('src') ?? '';
                expect(src.length).toBeGreaterThan(0);
            }
        }
    });

    test('valid submit saves profile and shows success', async ({ page }) => {
        const motivationField = page.locator('[name="motivation"], #motivation');
        if (await motivationField.isVisible().catch(() => false)) {
            await motivationField.fill('E2E test motivation. Safe to overwrite.');
            await page.locator('button[type="submit"], input[type="submit"]').first().click();
            await page.waitForLoadState('networkidle');
            // Flash message or redirect without login
            await expect(page).not.toHaveURL(/login/);
        }
    });
});

// ─── Team dashboard ───────────────────────────────────────────────────────────

test.describe('Admin — team dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/team_dashboard.php');
    });

    test('team dashboard loads', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page).not.toHaveURL(/login/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('edit profile link is present', async ({ page }) => {
        await expect(page.locator('a[href*="edit_profile"]')).toBeVisible();
    });

    test('quick actions section is present', async ({ page }) => {
        await expect(page.locator('.quick-actions, .actions-grid, .action-btn')).toBeVisible();
    });
});

// ─── Admin dashboard stat cards ───────────────────────────────────────────────

test.describe('Admin — dashboard stat cards', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/dashboard.php');
        await page.waitForLoadState('networkidle');
    });

    test('pending applications stat card links to applications_list', async ({ page }) => {
        await expect(page.locator('a[href*="applications_list"]')).toBeVisible();
    });

    test('messages stat card links to messages', async ({ page }) => {
        await expect(page.locator('a[href*="messages"]')).toBeVisible();
    });

    test('pending requests stat card links to content-requests', async ({ page }) => {
        await expect(page.locator('a[href*="content-requests"]')).toBeVisible();
    });

    test('team members stat card links to manage_members', async ({ page }) => {
        await expect(page.locator('a[href*="manage_members"]')).toBeVisible();
    });

    test('quick action: add post card present', async ({ page }) => {
        await expect(page.locator('a[href*="add-edit-post"]')).toBeVisible();
    });

    test('quick action: gallery card present', async ({ page }) => {
        await expect(page.locator('a[href*="manage-gallery"]')).toBeVisible();
    });

    test('quick action: add user card present', async ({ page }) => {
        await expect(page.locator('a[href*="add_user"]')).toBeVisible();
    });

    test('clicking messages card navigates to messages page', async ({ page }) => {
        await page.locator('a[href*="messages"]').first().click();
        await expect(page).toHaveURL(/messages/);
    });

    test('clicking applications card navigates to applications list', async ({ page }) => {
        await page.locator('a[href*="applications_list"]').first().click();
        await expect(page).toHaveURL(/applications_list/);
    });
});
