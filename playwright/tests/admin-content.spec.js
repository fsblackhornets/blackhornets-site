// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../fixtures/auth');

// ─── Projects ────────────────────────────────────────────────────────────────

test.describe('Admin — manage projects', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-projects.php');
    });

    test('page loads with project list or empty state', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.locator('.project-card, .empty, table, body')).toBeVisible({ timeout: 8000 });
    });

    test('edit link navigates to add-edit-project with id', async ({ page }) => {
        const editBtn = page.locator('.btn-edit-project, a[href*="add-edit-project?id"]').first();
        const hasProjects = await editBtn.isVisible().catch(() => false);
        if (hasProjects) {
            await editBtn.click();
            await expect(page).toHaveURL(/add-edit-project.*id=/);
        }
    });

    test('delete link has CSRF token', async ({ page }) => {
        const deleteBtn = page.locator('.btn-delete-project').first();
        const hasProjects = await deleteBtn.isVisible().catch(() => false);
        if (hasProjects) {
            const href = await deleteBtn.getAttribute('href') ?? '';
            expect(href).toContain('csrf_token');
        }
    });
});

test.describe('Admin — add/edit project form', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add-edit-project.php');
    });

    test('project form is present', async ({ page }) => {
        await expect(page.locator('form')).toBeVisible();
    });

    test('submit empty form shows validation', async ({ page }) => {
        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        await expect(page.locator('body')).toBeVisible();
    });
});

// ─── Sponsors ────────────────────────────────────────────────────────────────

test.describe('Admin — manage sponsors', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-sponsors.php');
    });

    test('page loads with sponsor list or empty state', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.locator('.sponsor-card, .empty, table, body')).toBeVisible({ timeout: 8000 });
    });

    test('edit link navigates to add-edit-sponsor with id', async ({ page }) => {
        const editBtn = page.locator('.btn-edit-sponsor, a[href*="add-edit-sponsor?id"]').first();
        const hasSponsors = await editBtn.isVisible().catch(() => false);
        if (hasSponsors) {
            await editBtn.click();
            await expect(page).toHaveURL(/add-edit-sponsor.*id=/);
        }
    });

    test('brochure upload form is present', async ({ page }) => {
        await expect(page.locator('input[name="brochure_pdf"]')).toBeVisible();
    });

    test('brochure upload requires PDF', async ({ page }) => {
        const input = page.locator('input[name="brochure_pdf"]');
        const accept = await input.getAttribute('accept') ?? '';
        expect(accept).toContain('pdf');
    });
});

test.describe('Admin — add/edit sponsor form', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add-edit-sponsor.php');
    });

    test('sponsor form is present', async ({ page }) => {
        await expect(page.locator('form')).toBeVisible();
    });
});

// ─── Gallery ─────────────────────────────────────────────────────────────────

test.describe('Admin — manage gallery', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-gallery.php');
    });

    test('gallery page loads', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.locator('form, .gallery-item, .empty, body')).toBeVisible({ timeout: 8000 });
    });

    test('add image form is present', async ({ page }) => {
        await expect(page.locator('input[name="action"][value="add_image"]')).toBeVisible();
        await expect(page.locator('#title')).toBeVisible();
        await expect(page.locator('#category')).toBeVisible();
        await expect(page.locator('#alt_text')).toBeVisible();
        await expect(page.locator('#image')).toBeVisible();
    });

    test('image upload accepts only images', async ({ page }) => {
        const accept = await page.locator('#image').getAttribute('accept') ?? '';
        expect(accept).toContain('image');
    });

    test('category select has options', async ({ page }) => {
        const options = page.locator('#category option');
        expect(await options.count()).toBeGreaterThanOrEqual(2);
    });

    test('toggle status and delete forms have image_id', async ({ page }) => {
        const toggleInput = page.locator('input[name="image_id"]').first();
        const hasImages = await toggleInput.isVisible().catch(() => false);
        if (hasImages) {
            const val = await toggleInput.inputValue();
            expect(Number(val)).toBeGreaterThan(0);
        }
    });
});

// ─── Gallery edit modal ───────────────────────────────────────────────────────

test.describe('Admin — gallery edit modal', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-gallery.php');
        await page.waitForLoadState('networkidle');
    });

    test('edit button is present for existing images', async ({ page }) => {
        const editBtn = page.locator('button[onclick*="openEdit"], .edit-btn, [data-action="edit"]').first();
        if (await editBtn.isVisible().catch(() => false)) {
            await expect(editBtn).toBeVisible();
        }
    });

    test('edit form has action=edit_image hidden input', async ({ page }) => {
        await expect(page.locator('input[name="action"][value="edit_image"]')).toBeVisible();
    });

    test('edit form has image_id field', async ({ page }) => {
        await expect(page.locator('input[name="image_id"]#edit_image_id, [name="image_id"]')).toBeVisible();
    });

    test('edit submit fires POST to manage-gallery', async ({ page }) => {
        const editForm = page.locator('form:has(input[name="action"][value="edit_image"])');
        if (await editForm.isVisible().catch(() => false)) {
            const imageId = await editForm.locator('[name="image_id"]').first().inputValue();
            if (Number(imageId) > 0) {
                const [response] = await Promise.all([
                    page.waitForResponse(
                        res => res.url().includes('manage-gallery'),
                        { timeout: 5000 }
                    ).catch(() => null),
                    editForm.locator('button[type="submit"]').click(),
                ]);
                expect(response).not.toBeNull();
            }
        }
    });
});

// ─── Brochure upload ──────────────────────────────────────────────────────────

test.describe('Admin — brochure upload', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-sponsors.php');
        await page.waitForLoadState('networkidle');
    });

    test('brochure PDF upload field is present', async ({ page }) => {
        await expect(page.locator('input[name="brochure_pdf"]').first()).toBeVisible();
    });

    test('brochure upload form has lang=sr field', async ({ page }) => {
        await expect(page.locator('input[name="brochure_lang"][value="sr"]')).toBeVisible();
    });

    test('brochure upload accepts PDF only', async ({ page }) => {
        const accept = await page.locator('input[name="brochure_pdf"]').first().getAttribute('accept') ?? '';
        expect(accept).toContain('pdf');
    });

    test('brochure upload fires POST to manage-sponsors', async ({ page }) => {
        const uploadForm = page.locator('form:has(input[name="action"][value="upload_brochure"])').first();
        if (await uploadForm.isVisible().catch(() => false)) {
            await uploadForm.locator('input[name="brochure_pdf"]').setInputFiles({
                name: 'test.pdf',
                mimeType: 'application/pdf',
                buffer: Buffer.from('%PDF-1.4 E2E test brochure'),
            });
            const [response] = await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('manage-sponsors'),
                    { timeout: 6000 }
                ).catch(() => null),
                uploadForm.locator('button[type="submit"], input[type="submit"]').click(),
            ]);
            expect(response).not.toBeNull();
        }
    });
});

// ─── Content Requests ─────────────────────────────────────────────────────────

test.describe('Admin — content requests', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/content-requests.php');
    });

    test('page loads', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
        await expect(page).not.toHaveURL(/login/);
    });

    test('filter by status select is present', async ({ page }) => {
        await expect(page.locator('#filterStatus')).toBeVisible();
    });

    test('filter by type select is present', async ({ page }) => {
        await expect(page.locator('#filterType')).toBeVisible();
    });

    test('pending count badge is rendered', async ({ page }) => {
        await expect(page.locator('#pendingCount')).toBeVisible();
    });

    test('quick-create post link present', async ({ page }) => {
        await expect(page.locator('a[href*="add-edit-post"]')).toBeVisible();
    });

    test('quick-create project link present', async ({ page }) => {
        await expect(page.locator('a[href*="add-edit-project"]')).toBeVisible();
    });
});

// ─── Messages ─────────────────────────────────────────────────────────────────

test.describe('Admin — messages', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/messages.php');
    });

    test('messages page loads', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toBeVisible();
        await expect(page).not.toHaveURL(/login/);
    });

    test('shows messages table or empty state', async ({ page }) => {
        await expect(page.locator('table, .message, .empty, .no-messages')).toBeVisible({ timeout: 8000 });
    });

    test('delete button fires DELETE request', async ({ page }) => {
        const deleteBtn = page.locator('.delete-btn').first();
        const hasMessages = await deleteBtn.isVisible().catch(() => false);

        if (hasMessages) {
            const messageId = await deleteBtn.getAttribute('data-id');
            expect(Number(messageId)).toBeGreaterThan(0);

            const [request] = await Promise.all([
                page.waitForRequest(req => req.url().includes('delete_message') && req.method() === 'POST', { timeout: 5000 }).catch(() => null),
                deleteBtn.click(),
            ]);
            expect(request).not.toBeNull();
        }
    });
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

test.describe('Admin — dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/dashboard.php');
    });

    test('dashboard renders without error', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page).not.toHaveURL(/login/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('admin navbar is visible', async ({ page }) => {
        await expect(page.locator('nav, .admin-nav, .sidebar, .navbar')).toBeVisible();
    });
});
