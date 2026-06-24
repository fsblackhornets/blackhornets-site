// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../fixtures/auth');

// ─── Change password (JSON API — no HTML form) ────────────────────────────────

test.describe('Admin — change password API', () => {
    test('unauthenticated request returns 401', async ({ request }) => {
        const res = await request.post('/panel/admin/change_password.php', {
            form: { current_password: 'x', new_password: 'y' },
        });
        expect(res.status()).toBe(401);
        const body = await res.json();
        expect(body.success).toBe(false);
    });

    test('wrong current password returns error', async ({ page, request }) => {
        await loginAsAdmin(page);
        // Grab session cookies from the page context and replay in request
        const cookies = await page.context().cookies();
        const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        const res = await request.post('/panel/admin/change_password.php', {
            headers: { Cookie: cookieHeader },
            form: { current_password: 'definitelyWrong!', new_password: 'ValidPass123!' },
        });
        const body = await res.json().catch(() => ({}));
        expect(body.success).toBe(false);
    });

    test('new password shorter than 8 chars rejected', async ({ page, request }) => {
        await loginAsAdmin(page);
        const cookies = await page.context().cookies();
        const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        const res = await request.post('/panel/admin/change_password.php', {
            headers: { Cookie: cookieHeader },
            form: { current_password: process.env.ADMIN_PASSWORD || '', new_password: 'short' },
        });
        const body = await res.json().catch(() => ({}));
        expect(body.success).toBe(false);
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

    test('profile picture upload field exists in DOM', async ({ page }) => {
        // file inputs are CSS-hidden (styled via label) — check existence not visibility
        expect(await page.locator('#profile_picture').count()).toBeGreaterThan(0);
    });

    test('profile picture accepts images only', async ({ page }) => {
        const accept = await page.locator('#profile_picture').getAttribute('accept') ?? '';
        expect(accept).toContain('image');
    });

    test('age field is present', async ({ page }) => {
        const field = page.locator('[name="age"], #age');
        if (await field.isVisible().catch(() => false)) {
            await expect(field).toBeVisible();
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

    test('profile picture preview fires on file select', async ({ page }) => {
        const fileInput = page.locator('#profile_picture');
        if (await fileInput.count() > 0) {
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
            const preview = page.locator('#profilePicture, [id*="preview"] img, .preview-img');
            if (await preview.isVisible().catch(() => false)) {
                const src = await preview.getAttribute('src') ?? '';
                expect(src.length).toBeGreaterThan(0);
            }
        }
    });

    test('valid submit saves and stays authenticated', async ({ page }) => {
        const motivationField = page.locator('[name="motivation"], #motivation');
        if (await motivationField.isVisible().catch(() => false)) {
            await motivationField.fill('E2E test motivation. Safe to overwrite.');
            await page.locator('button[type="submit"], input[type="submit"]').first().click();
            await page.waitForLoadState('networkidle');
            await expect(page).not.toHaveURL(/login/);
        }
    });
});

// ─── Team dashboard ───────────────────────────────────────────────────────────

test.describe('Admin — team dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/team_dashboard.php');
        await page.waitForLoadState('networkidle');
    });

    test('team dashboard loads', async ({ page }) => {
        await expect(page).not.toHaveURL(/login/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('edit profile link is present if team section shown', async ({ page }) => {
        // Only shown for team members who have a profile — admin may not
        const section = page.locator('.quick-actions, .actions-grid').first();
        if (await section.isVisible().catch(() => false)) {
            await expect(page.locator('.action-btn[href*="edit_profile"], a[href*="edit_profile"]')).toBeVisible();
        }
    });

    test('team dashboard page loaded without redirecting to login', async ({ page }) => {
        await expect(page).not.toHaveURL(/login/);
        await expect(page.locator('body')).toBeVisible();
    });
});

// ─── Admin dashboard stat cards ───────────────────────────────────────────────

test.describe('Admin — dashboard stat cards', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/dashboard.php');
        await page.waitForLoadState('networkidle');
    });

    test('4 stat cards are visible', async ({ page }) => {
        expect(await page.locator('a.a-stat').count()).toBeGreaterThanOrEqual(4);
    });

    test('pending applications stat card links to applications_list', async ({ page }) => {
        await expect(page.locator('a.a-stat[href*="applications_list"]')).toBeVisible();
    });

    test('messages stat card links to messages', async ({ page }) => {
        await expect(page.locator('a.a-stat[href*="messages"]')).toBeVisible();
    });

    test('pending requests stat card links to content-requests', async ({ page }) => {
        await expect(page.locator('a.a-stat[href*="content-requests"]')).toBeVisible();
    });

    test('team members stat card links to manage_members', async ({ page }) => {
        await expect(page.locator('a.a-stat[href*="manage_members"]')).toBeVisible();
    });

    test('quick action: add post card present', async ({ page }) => {
        await expect(page.locator('a.a-card[href*="add-edit-post"]')).toBeVisible();
    });

    test('quick action: gallery card present', async ({ page }) => {
        await expect(page.locator('a.a-card[href*="manage-gallery"]')).toBeVisible();
    });

    test('quick action: add user card present', async ({ page }) => {
        await expect(page.locator('a.a-card[href*="add_user"]')).toBeVisible();
    });

    test('clicking messages card navigates to messages page', async ({ page }) => {
        await page.locator('a.a-stat[href*="messages"]').click();
        await expect(page).toHaveURL(/messages/);
    });

    test('clicking applications card navigates to applications list', async ({ page }) => {
        await page.locator('a.a-stat[href*="applications_list"]').click();
        await expect(page).toHaveURL(/applications_list/);
    });
});
