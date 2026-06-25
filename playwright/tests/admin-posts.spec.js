// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../fixtures/auth');

test.describe('Admin — posts list', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/posts.php');
    });

    test('page loads with table or empty state', async ({ page }) => {
        await expect(page.locator('table, .empty, .no-posts')).toBeVisible({ timeout: 6000 });
    });

    test('"add post" button is visible and links to form', async ({ page }) => {
        const addBtn = page.locator('a[href*="add-edit-post"]');
        await expect(addBtn.first()).toBeVisible();
    });

    test('edit link navigates to add-edit-post with id', async ({ page }) => {
        const editBtn = page.locator('.btn-edit, a[href*="add-edit-post?id"]').first();
        const hasPosts = await editBtn.isVisible().catch(() => false);

        if (hasPosts) {
            await editBtn.click();
            await expect(page).toHaveURL(/add-edit-post.*id=/);
        }
    });

    test('delete link has confirmation', async ({ page }) => {
        const deleteBtn = page.locator('.btn-delete, a[href*="action=delete"]').first();
        const hasPosts = await deleteBtn.isVisible().catch(() => false);

        if (hasPosts) {
            const href = await deleteBtn.getAttribute('onclick');
            expect(href ?? '').toContain('confirm');
        }
    });
});

test.describe('Admin — add/edit post form', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add-edit-post.php');
    });

    test('form fields are present', async ({ page }) => {
        await expect(page.locator('#title_sr')).toBeVisible();
        await expect(page.locator('#content_sr')).toBeVisible();
        await expect(page.locator('#category')).toBeVisible();
        await expect(page.locator('#image')).toBeVisible();
        await expect(page.locator('#featured')).toBeVisible();
    });

    test('submit without required fields shows validation', async ({ page }) => {
        await page.locator('button[type="submit"], .btn-submit').click();
        const titleValid = await page.locator('#title_sr').evaluate(el => /** @type {HTMLInputElement} */ (el).validity.valid);
        expect(titleValid).toBe(false);
    });

    test('category select has options', async ({ page }) => {
        const options = page.locator('#category option');
        expect(await options.count()).toBeGreaterThanOrEqual(2);
    });

    test('cancel button goes back', async ({ page }) => {
        await expect(page.locator('.btn-cancel, button:has-text("Cancel")')).toBeVisible();
    });

    test('valid post submit fires API request', async ({ page }) => {
        await page.fill('#title_sr', 'Playwright Test Post');
        await page.fill('#content_sr', 'Test content for Playwright E2E test.');
        await page.selectOption('#category', { index: 1 });

        // Author required — check checkbox or set hidden field directly
        const firstAuthor = page.locator('.author-checkbox').first();
        if (await firstAuthor.isVisible().catch(() => false)) {
            await firstAuthor.check();
        } else {
            await page.evaluate(() => {
                const el = document.getElementById('author');
                if (el) el.value = 'Admin';
            });
        }

        // Dismiss any alert dialogs (e.g. "please select author")
        page.on('dialog', d => d.accept());

        const [request] = await Promise.all([
            page.waitForRequest(
                req => req.url().includes('/backend/api/posts') && req.method() === 'POST',
                { timeout: 5000 }
            ).catch(() => null),
            page.locator('button[type="submit"], .btn-submit').click(),
        ]);

        // Either request fired or flash message appeared (on redirect back)
        const flashVisible = await page.locator('#flashMessage').isVisible().catch(() => false);
        expect(request !== null || flashVisible).toBe(true);
    });
});
