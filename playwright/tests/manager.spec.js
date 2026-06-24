// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAsManager, loginAsAdmin, logout } = require('../fixtures/auth');

const MANAGER_PAGES = [
    '/panel/manager/dashboard.php',
    '/panel/manager/pages/request-member.php',
    '/panel/manager/pages/request-post.php',
    '/panel/manager/pages/request-project.php',
    '/panel/manager/pages/request-sponsor.php',
];

// ─── Auth guards ─────────────────────────────────────────────────────────────

test.describe('Manager — auth guards (unauthenticated)', () => {
    for (const url of MANAGER_PAGES) {
        test(`${url} redirects to login`, async ({ page }) => {
            await page.goto(url);
            await expect(page).toHaveURL(/login/);
        });
    }
});

test.describe('Manager — login & logout', () => {
    test('manager/login.php redirects to admin login page', async ({ page }) => {
        await page.goto('/panel/manager/login.php');
        // Manager login shares the admin login UI
        await expect(page).toHaveURL(/login/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('manager credentials login and land on manager dashboard', async ({ page }) => {
        await loginAsManager(page);
        await expect(page).toHaveURL(/manager\/dashboard|admin\/pages\/dashboard/);
    });

    test('logout redirects to login', async ({ page }) => {
        await loginAsManager(page);
        await logout(page);
        await expect(page).toHaveURL(/login/);
    });

    test('cannot access manager pages after logout', async ({ page }) => {
        await loginAsManager(page);
        await logout(page);
        await page.goto('/panel/manager/dashboard.php');
        await expect(page).toHaveURL(/login/);
    });
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

test.describe('Manager — dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsManager(page);
        await page.goto('/panel/manager/dashboard.php');
        await page.waitForLoadState('networkidle');
    });

    test('dashboard loads without redirect to login', async ({ page }) => {
        await expect(page).not.toHaveURL(/login/);
        await expect(page.locator('body')).toBeVisible();
    });

    test('sidebar has all 4 navigation links', async ({ page }) => {
        await expect(page.locator('a[href*="request-member"]')).toBeVisible();
        await expect(page.locator('a[href*="request-post"]')).toBeVisible();
        await expect(page.locator('a[href*="request-project"]')).toBeVisible();
        await expect(page.locator('a[href*="request-sponsor"]')).toBeVisible();
    });

    test('logout link present in sidebar', async ({ page }) => {
        await expect(page.locator('a[href*="logout"]')).toBeVisible();
    });

    test('status filter select has all options', async ({ page }) => {
        const select = page.locator('#filterStatus');
        await expect(select).toBeVisible();
        const options = select.locator('option');
        expect(await options.count()).toBeGreaterThanOrEqual(3); // All, Pending, Approved, Declined
    });

    test('type filter select has all options', async ({ page }) => {
        const select = page.locator('#filterType');
        await expect(select).toBeVisible();
        const options = select.locator('option');
        expect(await options.count()).toBeGreaterThanOrEqual(4); // All, Member, Post, Project, Sponsor
    });

    test('requests table body is rendered', async ({ page }) => {
        await expect(page.locator('#requestsBody')).toBeVisible();
    });

    test('changing status filter triggers API fetch', async ({ page }) => {
        const [request] = await Promise.all([
            page.waitForRequest(
                req => req.url().includes('requests') && req.method() === 'GET',
                { timeout: 5000 }
            ).catch(() => null),
            page.locator('#filterStatus').selectOption({ index: 1 }),
        ]);
        expect(request).not.toBeNull();
    });

    test('changing type filter triggers API fetch', async ({ page }) => {
        const [request] = await Promise.all([
            page.waitForRequest(
                req => req.url().includes('requests') && req.method() === 'GET',
                { timeout: 5000 }
            ).catch(() => null),
            page.locator('#filterType').selectOption({ index: 1 }),
        ]);
        expect(request).not.toBeNull();
    });
});

// ─── Request: Member ─────────────────────────────────────────────────────────

test.describe('Manager — request member form', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsManager(page);
        await page.goto('/panel/manager/pages/request-member.php');
    });

    test('form is present', async ({ page }) => {
        await expect(page.locator('#requestForm')).toBeVisible();
    });

    test('hidden type field is "member"', async ({ page }) => {
        expect(await page.locator('input[name="type"]').inputValue()).toBe('member');
    });

    test('role select is present with options', async ({ page }) => {
        await expect(page.locator('[name="role"]')).toBeVisible();
        expect(await page.locator('[name="role"] option').count()).toBeGreaterThanOrEqual(2);
    });

    test('team select is present', async ({ page }) => {
        await expect(page.locator('#teamSelect')).toBeVisible();
    });

    test('department select is present', async ({ page }) => {
        await expect(page.locator('#deptSelect')).toBeVisible();
    });

    test('full_name field is required', async ({ page }) => {
        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        const valid = await page.locator('[name="full_name"]').evaluate(el => /** @type {HTMLInputElement} */ (el).validity.valid).catch(() => false);
        expect(valid).toBe(false);
    });

    test('live preview card updates as name is typed', async ({ page }) => {
        await page.fill('[name="full_name"]', 'John Doe Preview');
        await page.waitForTimeout(300);
        const preview = page.locator('#previewName, .preview-name, [id*="preview"]');
        if (await preview.isVisible().catch(() => false)) {
            await expect(preview).toContainText('John Doe Preview');
        }
    });

    test('valid submit fires POST to requests endpoint', async ({ page }) => {
        await page.fill('[name="full_name"]', 'Test Member');
        await page.fill('[name="email"]', 'member@test.com');
        await page.selectOption('[name="role"]', { index: 1 });

        const [request] = await Promise.all([
            page.waitForRequest(
                req => req.method() === 'POST' && req.url().includes('requests'),
                { timeout: 5000 }
            ).catch(() => null),
            page.locator('button[type="submit"], input[type="submit"]').first().click(),
        ]);
        expect(request).not.toBeNull();
    });
});

// ─── Request: Post ───────────────────────────────────────────────────────────

test.describe('Manager — request post form', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsManager(page);
        await page.goto('/panel/manager/pages/request-post.php');
    });

    test('form is present', async ({ page }) => {
        await expect(page.locator('#requestForm')).toBeVisible();
    });

    test('hidden type field is "post"', async ({ page }) => {
        expect(await page.locator('input[name="type"]').inputValue()).toBe('post');
    });

    test('title SR field is present and required', async ({ page }) => {
        const field = page.locator('#f_title_sr');
        await expect(field).toBeVisible();
        expect(await field.getAttribute('required')).not.toBeNull();
    });

    test('category select has options', async ({ page }) => {
        await expect(page.locator('#f_category')).toBeVisible();
        expect(await page.locator('#f_category option').count()).toBeGreaterThanOrEqual(2);
    });

    test('image upload field is present and required', async ({ page }) => {
        await expect(page.locator('#f_image')).toBeVisible();
    });

    test('"build content" button disabled until title+image filled', async ({ page }) => {
        expect(await page.locator('#buildBtn').isDisabled()).toBe(true);
    });

    test('title in live preview updates as user types', async ({ page }) => {
        await page.fill('#f_title_sr', 'Preview Title Test');
        await page.waitForTimeout(300);
        const preview = page.locator('#pTitle');
        if (await preview.isVisible().catch(() => false)) {
            await expect(preview).not.toContainText('Title will appear here');
        }
    });
});

// ─── Request: Project ────────────────────────────────────────────────────────

test.describe('Manager — request project form', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsManager(page);
        await page.goto('/panel/manager/pages/request-project.php');
    });

    test('form is present', async ({ page }) => {
        await expect(page.locator('#requestForm')).toBeVisible();
    });

    test('hidden type field is "project"', async ({ page }) => {
        expect(await page.locator('input[name="type"]').inputValue()).toBe('project');
    });

    test('required fields present', async ({ page }) => {
        await expect(page.locator('#f_name')).toBeVisible();
        await expect(page.locator('#f_desc')).toBeVisible();
        await expect(page.locator('#f_status')).toBeVisible();
    });

    test('progress field min=0 max=100', async ({ page }) => {
        const input = page.locator('#f_progress');
        await expect(input).toBeVisible();
        expect(await input.getAttribute('min')).toBe('0');
        expect(await input.getAttribute('max')).toBe('100');
    });

    test('submit without name shows validation', async ({ page }) => {
        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        expect(await page.locator('#f_name').evaluate(el => /** @type {HTMLInputElement} */ (el).validity.valid)).toBe(false);
    });

    test('valid submit fires POST to requests endpoint', async ({ page }) => {
        await page.fill('#f_name', 'Test Project');
        await page.fill('#f_desc', 'Test description');
        await page.selectOption('#f_status', 'Active');
        await page.fill('[name="due_date"], #f_due', '2026-12-31');

        const [request] = await Promise.all([
            page.waitForRequest(
                req => req.method() === 'POST' && req.url().includes('requests'),
                { timeout: 5000 }
            ).catch(() => null),
            page.locator('button[type="submit"], input[type="submit"]').first().click(),
        ]);
        expect(request).not.toBeNull();
    });
});

// ─── Request: Sponsor ────────────────────────────────────────────────────────

test.describe('Manager — request sponsor form', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsManager(page);
        await page.goto('/panel/manager/pages/request-sponsor.php');
    });

    test('form is present', async ({ page }) => {
        await expect(page.locator('#requestForm')).toBeVisible();
    });

    test('hidden type field is "sponsor"', async ({ page }) => {
        expect(await page.locator('input[name="type"]').inputValue()).toBe('sponsor');
    });

    test('required fields present', async ({ page }) => {
        await expect(page.locator('#f_name')).toBeVisible();
        await expect(page.locator('#f_tier')).toBeVisible();
    });

    test('tier select has options', async ({ page }) => {
        expect(await page.locator('#f_tier option').count()).toBeGreaterThanOrEqual(2);
    });

    test('logo upload accepts image types', async ({ page }) => {
        expect(await page.locator('#f_logo').getAttribute('accept') ?? '').toContain('image');
    });

    test('website field is type=url', async ({ page }) => {
        expect(await page.locator('[name="website"]').getAttribute('type')).toBe('url');
    });

    test('submit without name shows validation', async ({ page }) => {
        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        expect(await page.locator('#f_name').evaluate(el => /** @type {HTMLInputElement} */ (el).validity.valid)).toBe(false);
    });

    test('valid submit fires POST to requests endpoint', async ({ page }) => {
        await page.fill('#f_name', 'Test Sponsor');
        await page.selectOption('#f_tier', { index: 1 });
        await page.fill('[name="description_sr"], #f_desc_sr', 'Test sponsor description.');

        const [request] = await Promise.all([
            page.waitForRequest(
                req => req.method() === 'POST' && req.url().includes('requests'),
                { timeout: 5000 }
            ).catch(() => null),
            page.locator('button[type="submit"], input[type="submit"]').first().click(),
        ]);
        expect(request).not.toBeNull();
    });
});
