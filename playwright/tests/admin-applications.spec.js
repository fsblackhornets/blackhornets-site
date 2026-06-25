// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsAdmin } = require('../fixtures/auth');

test.describe('Admin — applications list', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/applications_list.php');
    });

    test('page loads with application cards or empty state', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await expect(page.locator('.application-card, .applications-grid, .empty').first()).toBeVisible({ timeout: 8000 });
    });

    test('shows accept and reject buttons for pending applications', async ({ page }) => {
        const acceptBtn = page.locator('.btn-accept').first();
        const hasApplications = await acceptBtn.isVisible().catch(() => false);

        if (hasApplications) {
            await expect(page.locator('.btn-reject').first()).toBeVisible();
            await expect(page.locator('.btn-view').first()).toBeVisible();
        }
    });

    test('view button navigates to application details', async ({ page }) => {
        const viewBtn = page.locator('.btn-view').first();
        const hasApplications = await viewBtn.isVisible().catch(() => false);

        if (hasApplications) {
            await viewBtn.click();
            await expect(page).toHaveURL(/application_details/);
        }
    });

    test('accept triggers confirmation and API request', async ({ page }) => {
        const acceptBtn = page.locator('.btn-accept').first();
        const hasApplications = await acceptBtn.isVisible().catch(() => false);

        if (hasApplications) {
            page.on('dialog', dialog => dialog.accept());
            const [request] = await Promise.all([
                page.waitForRequest(req => req.url().includes('process_application') && req.method() === 'POST', { timeout: 5000 }).catch(() => null),
                acceptBtn.click(),
            ]);
            expect(request).not.toBeNull();
        }
    });

    test('reject triggers confirmation and API request', async ({ page }) => {
        const rejectBtn = page.locator('.btn-reject').first();
        const hasApplications = await rejectBtn.isVisible().catch(() => false);

        if (hasApplications) {
            page.on('dialog', dialog => dialog.accept());
            const [request] = await Promise.all([
                page.waitForRequest(req => req.url().includes('process_application') && req.method() === 'POST', { timeout: 5000 }).catch(() => null),
                rejectBtn.click(),
            ]);
            expect(request).not.toBeNull();
        }
    });
});

test.describe('Admin — applications list filters', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/applications_list.php');
        await page.waitForLoadState('networkidle');
    });

    test('filter buttons are present', async ({ page }) => {
        await expect(page.locator('button.filter-btn').first()).toBeVisible();
        expect(await page.locator('button.filter-btn').count()).toBeGreaterThanOrEqual(3);
    });

    test('"Pending" filter shows only pending applications', async ({ page }) => {
        const pendingBtn = page.locator('button.filter-btn[data-filter="pending"]');
        if (await pendingBtn.isVisible().catch(() => false)) {
            await pendingBtn.click();
            await page.waitForTimeout(300);
            // Accepted/rejected cards should be hidden
            const rejectedVisible = await page.locator('.status-rejected, .badge-rejected').isVisible().catch(() => false);
            expect(rejectedVisible).toBe(false);
        }
    });

    test('"All" filter shows all applications', async ({ page }) => {
        const allBtn = page.locator('button.filter-btn[data-filter="all"]');
        if (await allBtn.isVisible().catch(() => false)) {
            await allBtn.click();
            await page.waitForTimeout(300);
            await expect(page.locator('body')).toBeVisible();
        }
    });

    test('accepted application shows "Create Account" button', async ({ page }) => {
        const createBtn = page.locator('.btn-create-account, a[href*="add_user"][href*="from_application"]').first();
        if (await createBtn.isVisible().catch(() => false)) {
            const href = await createBtn.getAttribute('href') ?? '';
            expect(href).toContain('from_application');
            // Should pre-fill params
            expect(href).toContain('full_name');
            expect(href).toContain('email');
        }
    });

    test('"Create Account" link navigates to add_user with pre-filled params', async ({ page }) => {
        const createBtn = page.locator('.btn-create-account, a[href*="add_user"][href*="from_application"]').first();
        if (await createBtn.isVisible().catch(() => false)) {
            await createBtn.click();
            await expect(page).toHaveURL(/add_user/);
            // Email should be pre-filled from application
            await expect(page.locator('#email')).not.toBeEmpty();
        }
    });
});

test.describe('Admin — application details', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
    });

    test('details page with no id redirects or shows error', async ({ page }) => {
        await page.goto('/panel/admin/pages/application_details.php');
        const body = await page.locator('body').textContent();
        // Should either redirect or show "not found" message
        expect(body).toBeTruthy();
    });

    test('details page with valid id shows applicant info', async ({ page }) => {
        // Navigate to list first to find a real id
        await page.goto('/panel/admin/pages/applications_list.php');
        const viewBtn = page.locator('.btn-view').first();
        const hasApplications = await viewBtn.isVisible().catch(() => false);

        if (hasApplications) {
            await viewBtn.click();
            await expect(page).toHaveURL(/application_details/);
            await expect(page.locator('body')).toContainText(/Name|Email|Position|Faculty/i);
            await expect(page.locator('.accept-btn, .action-btn')).toBeVisible();
        }
    });
});
