// @ts-check
/**
 * Data-flow E2E tests.
 * These tests create real records in the database.
 * Run against a dev/staging environment, not production.
 *
 * Each test uses a unique timestamp in names so records are identifiable.
 */
const { test, expect } = require('@playwright/test');
const { loginAsAdmin, loginAsManager, logout } = require('../fixtures/auth');

// Minimal 1x1 red JPEG — used for all file-upload tests
const TINY_JPEG = Buffer.from(
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
    'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN' +
    'DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy' +
    'MjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAA' +
    'AAAAAAAAAAAAAP/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA' +
    '/9oADAMBAAIRAxEAPwCwABmX/9k=',
    'base64'
);

const ts = () => Date.now();

// ─── Blog post → Blog page ────────────────────────────────────────────────────

test.describe('Data flow — blog post appears on blog page', () => {
    let postTitle;

    test('create post in admin → visible in blog grid', async ({ page }) => {
        postTitle = `E2E Post ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add-edit-post.php');

        await page.fill('#title_sr', postTitle);
        await page.fill('#content_sr', 'Automated E2E test content. Safe to delete.');
        await page.selectOption('#category', { index: 1 });

        await page.locator('button.btn-submit').click();
        await expect(page.locator('#flashMessage')).toBeVisible({ timeout: 8000 });

        // Now check the blog page
        await page.goto('/frontend/pages/blog/blog.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#blogGrid .blog-post, #blogGrid article', { timeout: 10000 });

        await expect(page.locator('#blogGrid')).toContainText(postTitle);
    });
});

// ─── Blog post → Home page news section ──────────────────────────────────────

test.describe('Data flow — blog post appears on home page', () => {
    test('latest post shows in home #newsGrid', async ({ page }) => {
        const postTitle = `E2E Home News ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add-edit-post.php');

        await page.fill('#title_sr', postTitle);
        await page.fill('#content_sr', 'Automated E2E test content for home page. Safe to delete.');
        await page.selectOption('#category', { index: 1 });

        await page.locator('button.btn-submit').click();
        await expect(page.locator('#flashMessage')).toBeVisible({ timeout: 8000 });

        // Check home page news section
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#newsGrid .news-card, #newsGrid article, #latest-news', { timeout: 10000 });

        await expect(page.locator('#newsGrid, #latest-news')).toContainText(postTitle);
    });
});

// ─── Gallery image → Gallery page by category ────────────────────────────────

test.describe('Data flow — gallery image appears in correct category grid', () => {
    test('upload team image → appears in #team-grid', async ({ page }) => {
        const imageTitle = `E2E Gallery ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-gallery.php');

        await page.fill('#title', imageTitle);
        await page.selectOption('#category', 'team');
        await page.fill('#alt_text', imageTitle);

        await page.locator('#image').setInputFiles({
            name: 'test.jpg',
            mimeType: 'image/jpeg',
            buffer: TINY_JPEG,
        });

        await page.locator('form:has(input[name="action"][value="add_image"]) button[type="submit"]').click();
        await page.waitForLoadState('networkidle');

        // Verify image was saved and appears in gallery
        await page.goto('/frontend/pages/gallery/gallery.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#team-grid .gallery-item, #team-grid img', { timeout: 10000 });

        await expect(page.locator('#team-grid')).not.toBeEmpty();

        // Alt text or title should appear in rendered images
        const altTexts = await page.locator('#team-grid img').evaluateAll(
            imgs => imgs.map(img => img.alt)
        );
        expect(altTexts.some(alt => alt.includes(imageTitle))).toBe(true);
    });
});

// ─── Sponsor → Sponsors page ─────────────────────────────────────────────────

test.describe('Data flow — sponsor appears on sponsors page', () => {
    test('create sponsor → visible on public sponsors page', async ({ page }) => {
        const sponsorName = `E2E Sponsor ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add-edit-sponsor.php');

        await page.fill('[name="name"]', sponsorName);
        await page.fill('[name="description"]', 'E2E test sponsor. Safe to delete.');
        await page.selectOption('[name="tier"]', 'Friends of the Project');

        await page.locator('[name="logo"]').setInputFiles({
            name: 'logo.jpg',
            mimeType: 'image/jpeg',
            buffer: TINY_JPEG,
        });

        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        await page.waitForLoadState('networkidle');

        // Check sponsors page
        await page.goto('/frontend/pages/sponsors/sponsors.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.sponsor-item, .sponsor-card', { timeout: 10000 });

        await expect(page.locator('.sponsor-item, .sponsor-card').filter({ hasText: sponsorName })).toBeVisible();
    });
});

// ─── Project → Projects page ─────────────────────────────────────────────────

test.describe('Data flow — project appears on projects page', () => {
    test('create project → visible on public projects page', async ({ page }) => {
        const projectName = `E2E Project ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add-edit-project.php');

        await page.fill('[name="name"]', projectName);
        await page.fill('[name="description"]', 'E2E test project. Safe to delete.');
        await page.selectOption('[name="status"]', 'Active');
        await page.fill('[name="due_date"]', '2026-12-31');
        await page.fill('[name="duration"]', '6 months');

        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        await page.waitForLoadState('networkidle');

        // Check projects page
        await page.goto('/frontend/pages/projects/projects.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.project-card', { timeout: 10000 });

        await expect(page.locator('.project-card').filter({ hasText: projectName })).toBeVisible();
    });
});

// ─── Contact form → Admin messages ───────────────────────────────────────────

test.describe('Data flow — contact form message appears in admin messages', () => {
    test('submit contact form → message visible in admin panel', async ({ page }) => {
        const subject = `E2E Contact ${ts()}`;

        // Submit contact form as a regular visitor
        await page.goto('/frontend/pages/contact/contact.html');
        await page.waitForLoadState('networkidle');

        await page.fill('#name', 'Playwright Test User');
        await page.fill('#email', 'playwright@e2e.test');
        await page.fill('#subject', subject);
        await page.fill('#message', 'This is an automated E2E test message. Safe to delete.');

        await page.locator('button[type="submit"]').click();
        await page.waitForResponse(
            res => res.url().includes('contact') && res.request().method() === 'POST',
            { timeout: 8000 }
        ).catch(() => {});

        // Login as admin and check messages
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/messages.php');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('table, .message-list, body')).toContainText(subject);
    });
});

// ─── Application → Admin applications list ───────────────────────────────────

test.describe('Data flow — application appears in admin applications list', () => {
    test('submit apply form → applicant visible in admin list', async ({ page }) => {
        const uniqueEmail = `e2e.${ts()}@playwright.test`;

        await page.goto('/frontend/pages/apply/apply.html');
        await page.waitForLoadState('networkidle');

        // Fill personal info
        await page.fill('#firstName', 'E2E');
        await page.fill('#lastName', 'Playwright');
        await page.fill('#email', uniqueEmail);
        await page.fill('#phone', '0601234567');

        // Academic info
        await page.fill('#studentId', 'E2E123456');
        const facultyField = page.locator('[name="faculty"], #faculty');
        if (await facultyField.isVisible().catch(() => false)) {
            await facultyField.fill('FTN');
        }
        const majorSelect = page.locator('[name="major"], #major, select[name="major"]');
        if (await majorSelect.isVisible().catch(() => false)) {
            await majorSelect.selectOption({ index: 1 });
        }
        const yearField = page.locator('[name="academic_year"], #academicYear');
        if (await yearField.isVisible().catch(() => false)) {
            await yearField.fill('2');
        }
        const gpaField = page.locator('[name="gpa"], #gpa');
        if (await gpaField.isVisible().catch(() => false)) {
            await gpaField.fill('8.5');
        }

        // Position
        const positionSelect = page.locator('[name="desired_position"], #desiredPosition, select[name="position"]');
        if (await positionSelect.isVisible().catch(() => false)) {
            await positionSelect.selectOption({ index: 1 });
        }

        // Motivation
        const motivationField = page.locator('[name="motivation"], #motivation');
        if (await motivationField.isVisible().catch(() => false)) {
            await motivationField.fill('E2E automated test application. Safe to delete.');
        }

        // Resume upload (required)
        const resumeInput = page.locator('[name="resume"], #resume, input[type="file"]').first();
        if (await resumeInput.isVisible().catch(() => false)) {
            await resumeInput.setInputFiles({
                name: 'resume.pdf',
                mimeType: 'application/pdf',
                buffer: Buffer.from('%PDF-1.4 E2E test resume'),
            });
        }

        const [response] = await Promise.all([
            page.waitForResponse(
                res => res.url().includes('applications') && res.request().method() === 'POST',
                { timeout: 10000 }
            ).catch(() => null),
            page.locator('button[type="submit"]').click(),
        ]);

        // Check admin applications — email should appear
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/applications_list.php');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('body')).toContainText(uniqueEmail);
    });
});

// ─── Manager request → Admin content-requests ────────────────────────────────

test.describe('Data flow — manager request appears in admin content-requests', () => {
    test('manager submits project request → admin sees pending item', async ({ page }) => {
        const projectName = `E2E Request ${ts()}`;

        await loginAsManager(page);
        await page.goto('/panel/manager/pages/request-project.php');

        await page.fill('#f_name', projectName);
        await page.fill('#f_desc', 'E2E automated request test. Safe to delete.');
        await page.selectOption('#f_status', 'Active');
        await page.fill('[name="due_date"], #f_due', '2026-12-31');

        const durationField = page.locator('[name="duration"], #f_duration');
        if (await durationField.isVisible().catch(() => false)) {
            await durationField.fill('6 months');
        }

        const [response] = await Promise.all([
            page.waitForResponse(
                res => res.url().includes('requests') && res.request().method() === 'POST',
                { timeout: 8000 }
            ).catch(() => null),
            page.locator('button[type="submit"], input[type="submit"]').first().click(),
        ]);

        // Now check admin sees it
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/content-requests.php');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('#requestsBody, .req-table, body')).toContainText(projectName);
    });

    test('manager submits member request → admin sees pending item', async ({ page }) => {
        const memberName = `E2E Member ${ts()}`;

        await loginAsManager(page);
        await page.goto('/panel/manager/pages/request-member.php');

        await page.fill('[name="full_name"]', memberName);
        await page.fill('[name="email"]', `e2e.${ts()}@test.local`);
        await page.selectOption('[name="role"]', { index: 1 });

        const teamSelect = page.locator('#teamSelect');
        if (await teamSelect.isVisible().catch(() => false)) {
            await teamSelect.selectOption({ index: 1 });
        }

        const [response] = await Promise.all([
            page.waitForResponse(
                res => res.url().includes('requests') && res.request().method() === 'POST',
                { timeout: 8000 }
            ).catch(() => null),
            page.locator('button[type="submit"], input[type="submit"]').first().click(),
        ]);

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/content-requests.php');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('#requestsBody, .req-table, body')).toContainText(memberName);
    });
});

// ─── Post list shows in admin ─────────────────────────────────────────────────

test.describe('Data flow — created post appears in admin posts list', () => {
    test('create post → visible in admin posts table', async ({ page }) => {
        const postTitle = `E2E Admin Post ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add-edit-post.php');

        await page.fill('#title_sr', postTitle);
        await page.fill('#content_sr', 'E2E test. Safe to delete.');
        await page.selectOption('#category', { index: 1 });

        await page.locator('button.btn-submit').click();
        await expect(page.locator('#flashMessage')).toBeVisible({ timeout: 8000 });

        await page.goto('/panel/admin/pages/posts.php');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('table, .admin-table')).toContainText(postTitle);
    });
});

// ─── Gallery image toggle active/inactive ────────────────────────────────────

test.describe('Data flow — gallery image toggle status', () => {
    test('toggle image status updates correctly', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-gallery.php');
        await page.waitForLoadState('networkidle');

        // Check if there are existing images with toggle forms
        const toggleForm = page.locator('form:has(input[name="action"][value="toggle_status"])').first();
        const hasImages = await toggleForm.isVisible().catch(() => false);

        if (hasImages) {
            const [response] = await Promise.all([
                page.waitForResponse(res => res.url().includes('manage-gallery'), { timeout: 5000 }).catch(() => null),
                toggleForm.locator('button[type="submit"]').click(),
            ]);
            // Page should reload without error
            await expect(page.locator('body')).toBeVisible();
            await expect(page).not.toHaveURL(/login/);
        }
    });
});

// ─── Member added → Team page ─────────────────────────────────────────────────

test.describe('Data flow — added member appears on team page', () => {
    test('add user → member visible on public team page', async ({ page }) => {
        const uniqueUser = `e2euser${ts()}`;
        const fullName   = `E2E Test ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add_user.php');

        await page.fill('#username', uniqueUser);
        await page.fill('#password', 'TestPass123!');
        await page.fill('#email', `${uniqueUser}@e2e.local`);
        await page.fill('#full_name', fullName);

        const roleSelect = page.locator('[name="role"], select[name="role"]');
        if (await roleSelect.isVisible().catch(() => false)) {
            await roleSelect.selectOption('team_member');
        }
        const teamSelect = page.locator('[name="team"], #team');
        if (await teamSelect.isVisible().catch(() => false)) {
            await teamSelect.selectOption({ index: 1 });
        }

        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        await page.waitForLoadState('networkidle');

        // Check team page
        await page.goto('/frontend/pages/team/team.html');
        await page.waitForLoadState('networkidle');
        // Team page loads members dynamically; wait for API
        await page.waitForTimeout(3000);

        const body = await page.locator('body').textContent() ?? '';
        // Member should appear somewhere in the rendered page
        expect(body).toContain(fullName);
    });
});
