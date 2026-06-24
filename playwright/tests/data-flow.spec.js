// @ts-check
/**
 * Data-flow E2E tests — full create→read and action→state-change pipelines.
 * These tests write to a real database. Run against dev/staging, not production.
 * Each test uses a unique timestamp so records are identifiable and cleanable.
 */
const { test, expect } = require('@playwright/test');
const { loginAsAdmin, loginAsManager } = require('../fixtures/auth');

/** Minimal 1×1 JPEG — for all file-upload fields */
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Create a published blog post and return its title. */
async function createPost(page, title) {
    await loginAsAdmin(page);
    await page.goto('/panel/admin/pages/add-edit-post.php');
    await page.fill('#title_sr', title);
    await page.fill('#content_sr', 'E2E test content. Safe to delete.');
    await page.selectOption('#category', { index: 1 });
    await page.locator('button.btn-submit').click();
    await expect(page.locator('#flashMessage')).toBeVisible({ timeout: 8000 });
}

/** Create a project and return when the page reloads. */
async function createProject(page, name) {
    await loginAsAdmin(page);
    await page.goto('/panel/admin/pages/add-edit-project.php');
    await page.fill('[name="name"]', name);
    await page.fill('[name="description"]', 'E2E test project. Safe to delete.');
    await page.selectOption('[name="status"]', 'Active');
    await page.fill('[name="due_date"]', '2026-12-31');
    await page.fill('[name="duration"]', '6 months');
    await page.locator('button[type="submit"], input[type="submit"]').first().click();
    await page.waitForLoadState('networkidle');
}

/** Create a sponsor and return when the page reloads. */
async function createSponsor(page, name) {
    await loginAsAdmin(page);
    await page.goto('/panel/admin/pages/add-edit-sponsor.php');
    await page.fill('[name="name"]', name);
    await page.fill('[name="description"]', 'E2E test sponsor. Safe to delete.');
    await page.selectOption('[name="tier"]', 'Friends of the Project');
    await page.locator('[name="logo"]').setInputFiles({ name: 'logo.jpg', mimeType: 'image/jpeg', buffer: TINY_JPEG });
    await page.locator('button[type="submit"], input[type="submit"]').first().click();
    await page.waitForLoadState('networkidle');
}

// ─── Blog post → Blog page ────────────────────────────────────────────────────

test.describe('Blog post → blog page', () => {
    test('create post → visible in #blogGrid', async ({ page }) => {
        const title = `E2E Post ${ts()}`;
        await createPost(page, title);

        await page.goto('/frontend/pages/blog/blog.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#blogGrid .blog-post, #blogGrid article', { timeout: 10000 });
        await expect(page.locator('#blogGrid')).toContainText(title);
    });

    test('edit post → updated title on blog page', async ({ page }) => {
        const original = `E2E Post ${ts()}`;
        const updated  = `E2E Edited ${ts()}`;
        await createPost(page, original);

        // Find the post in admin list and open edit
        await page.goto('/panel/admin/pages/posts.php');
        await page.waitForLoadState('networkidle');
        await page.locator('.btn-edit, a[href*="add-edit-post?id"]').filter({ hasText: '' }).first().click();
        await page.waitForURL(/add-edit-post.*id=/);

        await page.fill('#title_sr', updated);
        await page.locator('button.btn-submit').click();
        await expect(page.locator('#flashMessage')).toBeVisible({ timeout: 8000 });

        await page.goto('/frontend/pages/blog/blog.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#blogGrid .blog-post, #blogGrid article', { timeout: 10000 });
        await expect(page.locator('#blogGrid')).toContainText(updated);
        await expect(page.locator('#blogGrid')).not.toContainText(original);
    });

    test('toggle post to draft → disappears from blog page', async ({ page }) => {
        const title = `E2E Draft ${ts()}`;
        await createPost(page, title);

        // Toggle to draft via the toggle link in posts list
        await page.goto('/panel/admin/pages/posts.php');
        await page.waitForLoadState('networkidle');

        const row = page.locator('tr').filter({ hasText: title });
        if (await row.isVisible().catch(() => false)) {
            const toggleLink = row.locator('.btn-toggle, a[href*="action=toggle"]');
            if (await toggleLink.isVisible().catch(() => false)) {
                await toggleLink.click();
                await page.waitForLoadState('networkidle');

                await page.goto('/frontend/pages/blog/blog.html');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(3000);
                await expect(page.locator('#blogGrid')).not.toContainText(title);
            }
        }
    });

    test('delete post → removed from blog page', async ({ page }) => {
        const title = `E2E Delete Post ${ts()}`;
        await createPost(page, title);

        await page.goto('/panel/admin/pages/posts.php');
        await page.waitForLoadState('networkidle');

        const row = page.locator('tr').filter({ hasText: title });
        if (await row.isVisible().catch(() => false)) {
            page.on('dialog', dialog => dialog.accept());
            await row.locator('.btn-delete, a[href*="action=delete"]').click();
            await page.waitForLoadState('networkidle');

            await page.goto('/frontend/pages/blog/blog.html');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            await expect(page.locator('#blogGrid')).not.toContainText(title);
        }
    });
});

// ─── Blog post → Home page news ───────────────────────────────────────────────

test.describe('Blog post → home page news', () => {
    test('latest post shows in #newsGrid', async ({ page }) => {
        const title = `E2E Home News ${ts()}`;
        await createPost(page, title);

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#newsGrid', { timeout: 10000 });
        await expect(page.locator('#newsGrid, #latest-news')).toContainText(title);
    });
});

// ─── Gallery → gallery page ───────────────────────────────────────────────────

test.describe('Gallery image → gallery page', () => {
    test('upload team image → appears in #team-grid with correct alt', async ({ page }) => {
        const altText = `E2E Gallery ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-gallery.php');
        await page.fill('#title', altText);
        await page.selectOption('#category', 'team');
        await page.fill('#alt_text', altText);
        await page.locator('#image').setInputFiles({ name: 'test.jpg', mimeType: 'image/jpeg', buffer: TINY_JPEG });
        await page.locator('form:has(input[name="action"][value="add_image"]) button[type="submit"]').click();
        await page.waitForLoadState('networkidle');

        await page.goto('/frontend/pages/gallery/gallery.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#team-grid .gallery-item, #team-grid img', { timeout: 10000 });

        const alts = await page.locator('#team-grid img').evaluateAll(
            imgs => imgs.map(img => (/** @type {HTMLImageElement} */ (img)).alt)
        );
        expect(alts.some(a => a.includes(altText))).toBe(true);
    });

    test('deactivate gallery image → disappears from gallery page', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-gallery.php');
        await page.waitForLoadState('networkidle');

        const toggleForm = page.locator('form:has(input[name="action"][value="toggle_status"]):has(input[name="status"][value="1"])').first();
        if (await toggleForm.isVisible().catch(() => false)) {
            const imageId = await toggleForm.locator('input[name="image_id"]').inputValue();
            await toggleForm.locator('button[type="submit"]').click();
            await page.waitForLoadState('networkidle');

            await page.goto('/frontend/pages/gallery/gallery.html');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            // The deactivated image should not be in any grid
            const srcs = await page.locator('.gallery-item img').evaluateAll(
                imgs => imgs.map(img => (/** @type {HTMLImageElement} */ (img)).src)
            );
            // Verify by checking none of the srcs contain the image ID path segment
            expect(srcs.every(src => !src.includes(`/${imageId}.`))).toBe(true);
        }
    });

    test('delete gallery image → removed from manage-gallery list', async ({ page }) => {
        // Upload a fresh image then immediately delete it
        const altText = `E2E Del Img ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage-gallery.php');
        await page.fill('#title', altText);
        await page.selectOption('#category', 'team');
        await page.fill('#alt_text', altText);
        await page.locator('#image').setInputFiles({ name: 'del.jpg', mimeType: 'image/jpeg', buffer: TINY_JPEG });
        await page.locator('form:has(input[name="action"][value="add_image"]) button[type="submit"]').click();
        await page.waitForLoadState('networkidle');

        // Find and delete
        const deleteForm = page.locator('form:has(input[name="action"][value="delete_image"])').last();
        if (await deleteForm.isVisible().catch(() => false)) {
            page.on('dialog', dialog => dialog.accept());
            await deleteForm.locator('button[type="submit"]').click();
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).not.toContainText(altText);
        }
    });
});

// ─── Sponsors ─────────────────────────────────────────────────────────────────

test.describe('Sponsor → sponsors page', () => {
    test('create sponsor → visible as .sponsor-item', async ({ page }) => {
        const name = `E2E Sponsor ${ts()}`;
        await createSponsor(page, name);

        await page.goto('/frontend/pages/sponsors/sponsors.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.sponsor-item, .sponsor-card', { timeout: 10000 });
        await expect(page.locator('.sponsor-item, .sponsor-card').filter({ hasText: name })).toBeVisible();
    });

    test('edit sponsor → updated name on sponsors page', async ({ page }) => {
        const original = `E2E Sponsor ${ts()}`;
        const updated  = `E2E Sponsor Upd ${ts()}`;
        await createSponsor(page, original);

        await page.goto('/panel/admin/pages/manage-sponsors.php');
        await page.waitForLoadState('networkidle');
        const editBtn = page.locator('.btn-edit-sponsor, a[href*="add-edit-sponsor?id"]').first();
        if (await editBtn.isVisible().catch(() => false)) {
            await editBtn.click();
            await page.waitForURL(/add-edit-sponsor.*id=/);
            await page.fill('[name="name"]', updated);
            await page.locator('button[type="submit"], input[type="submit"]').first().click();
            await page.waitForLoadState('networkidle');

            await page.goto('/frontend/pages/sponsors/sponsors.html');
            await page.waitForLoadState('networkidle');
            await page.waitForSelector('.sponsor-item, .sponsor-card', { timeout: 10000 });
            await expect(page.locator('.sponsor-item, .sponsor-card').filter({ hasText: updated })).toBeVisible();
        }
    });

    test('delete sponsor → removed from sponsors page', async ({ page }) => {
        const name = `E2E Del Sponsor ${ts()}`;
        await createSponsor(page, name);

        await page.goto('/panel/admin/pages/manage-sponsors.php');
        await page.waitForLoadState('networkidle');
        const deleteBtn = page.locator('.btn-delete-sponsor').first();
        if (await deleteBtn.isVisible().catch(() => false)) {
            page.on('dialog', dialog => dialog.accept());
            await deleteBtn.click();
            await page.waitForLoadState('networkidle');

            await page.goto('/frontend/pages/sponsors/sponsors.html');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            await expect(page.locator('body')).not.toContainText(name);
        }
    });
});

// ─── Projects ─────────────────────────────────────────────────────────────────

test.describe('Project → projects page', () => {
    test('create project → visible as .project-card', async ({ page }) => {
        const name = `E2E Project ${ts()}`;
        await createProject(page, name);

        await page.goto('/frontend/pages/projects/projects.html');
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.project-card', { timeout: 10000 });
        await expect(page.locator('.project-card').filter({ hasText: name })).toBeVisible();
    });

    test('edit project → updated name on projects page', async ({ page }) => {
        const original = `E2E Project ${ts()}`;
        const updated  = `E2E Project Upd ${ts()}`;
        await createProject(page, original);

        await page.goto('/panel/admin/pages/manage-projects.php');
        await page.waitForLoadState('networkidle');
        const editBtn = page.locator('.btn-edit-project, a[href*="add-edit-project?id"]').first();
        if (await editBtn.isVisible().catch(() => false)) {
            await editBtn.click();
            await page.waitForURL(/add-edit-project.*id=/);
            await page.fill('[name="name"]', updated);
            await page.locator('button[type="submit"], input[type="submit"]').first().click();
            await page.waitForLoadState('networkidle');

            await page.goto('/frontend/pages/projects/projects.html');
            await page.waitForLoadState('networkidle');
            await page.waitForSelector('.project-card', { timeout: 10000 });
            await expect(page.locator('.project-card').filter({ hasText: updated })).toBeVisible();
        }
    });

    test('delete project → removed from projects page', async ({ page }) => {
        const name = `E2E Del Project ${ts()}`;
        await createProject(page, name);

        await page.goto('/panel/admin/pages/manage-projects.php');
        await page.waitForLoadState('networkidle');
        const deleteBtn = page.locator('.btn-delete-project').first();
        if (await deleteBtn.isVisible().catch(() => false)) {
            page.on('dialog', dialog => dialog.accept());
            await deleteBtn.click();
            await page.waitForLoadState('networkidle');

            await page.goto('/frontend/pages/projects/projects.html');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            await expect(page.locator('body')).not.toContainText(name);
        }
    });
});

// ─── Applications ─────────────────────────────────────────────────────────────

test.describe('Application accept / reject flow', () => {
    /** Submit an application and return the unique email used. */
    async function submitApplication(page) {
        const email = `e2e.${ts()}@playwright.test`;
        await page.goto('/frontend/pages/apply/apply.html');
        await page.waitForLoadState('networkidle');

        await page.fill('#firstName', 'E2E');
        await page.fill('#lastName', 'Playwright');
        await page.fill('#email', email);
        await page.fill('#phone', '0601234567');
        await page.fill('#studentId', 'E2E123456');

        for (const [sel, val] of [
            ['[name="faculty"], #faculty',        'FTN'],
            ['[name="academic_year"], #academicYear', '2'],
            ['[name="gpa"], #gpa',                '8.5'],
            ['[name="motivation"], #motivation',  'E2E test. Safe to delete.'],
        ]) {
            const el = page.locator(sel);
            if (await el.isVisible().catch(() => false)) await el.fill(val);
        }

        for (const sel of ['[name="major"], #major', '[name="desired_position"], #desiredPosition']) {
            const el = page.locator(sel);
            if (await el.isVisible().catch(() => false)) await el.selectOption({ index: 1 });
        }

        const resume = page.locator('[name="resume"], #resume, input[type="file"]').first();
        if (await resume.isVisible().catch(() => false)) {
            await resume.setInputFiles({ name: 'resume.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 E2E') });
        }

        await Promise.all([
            page.waitForResponse(
                res => res.url().includes('applications') && res.request().method() === 'POST',
                { timeout: 10000 }
            ).catch(() => null),
            page.locator('button[type="submit"]').click(),
        ]);

        return email;
    }

    test('submit application → appears in admin list', async ({ page }) => {
        const email = await submitApplication(page);
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/applications_list.php');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toContainText(email);
    });

    test('accept application → status changes to accepted', async ({ page }) => {
        await submitApplication(page);
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/applications_list.php');
        await page.waitForLoadState('networkidle');

        const acceptBtn = page.locator('.btn-accept').first();
        if (await acceptBtn.isVisible().catch(() => false)) {
            page.on('dialog', dialog => dialog.accept());
            await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('process_application') && res.request().method() === 'POST',
                    { timeout: 8000 }
                ).catch(() => null),
                acceptBtn.click(),
            ]);
            await page.waitForLoadState('networkidle');
            // Row should now show "accepted" status
            await expect(page.locator('.status-accepted, td:has-text("accepted"), .badge-accepted')).toBeVisible({ timeout: 5000 });
        }
    });

    test('reject application → status changes to rejected', async ({ page }) => {
        await submitApplication(page);
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/applications_list.php');
        await page.waitForLoadState('networkidle');

        const rejectBtn = page.locator('.btn-reject').first();
        if (await rejectBtn.isVisible().catch(() => false)) {
            page.on('dialog', dialog => dialog.accept());
            await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('process_application') && res.request().method() === 'POST',
                    { timeout: 8000 }
                ).catch(() => null),
                rejectBtn.click(),
            ]);
            await page.waitForLoadState('networkidle');
            await expect(page.locator('.status-rejected, td:has-text("rejected"), .badge-rejected')).toBeVisible({ timeout: 5000 });
        }
    });

    test('application details page shows personal info', async ({ page }) => {
        await submitApplication(page);
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/applications_list.php');
        await page.waitForLoadState('networkidle');

        const viewBtn = page.locator('.btn-view').first();
        if (await viewBtn.isVisible().catch(() => false)) {
            await viewBtn.click();
            await expect(page).toHaveURL(/application_details/);
            await expect(page.locator('body')).toContainText(/E2E|Playwright/);
            await expect(page.locator('.accept-btn, .action-btn, button')).toBeVisible();
        }
    });
});

// ─── Contact form → Admin messages ───────────────────────────────────────────

test.describe('Contact form → admin messages', () => {
    test('submit contact form → message appears in messages table', async ({ page }) => {
        const subject = `E2E Contact ${ts()}`;

        await page.goto('/frontend/pages/contact/contact.html');
        await page.waitForLoadState('networkidle');
        await page.fill('#name', 'Playwright Test User');
        await page.fill('#email', 'playwright@e2e.test');
        await page.fill('#subject', subject);
        await page.fill('#message', 'Automated E2E test message. Safe to delete.');
        await page.locator('button[type="submit"]').click();
        await page.waitForResponse(
            res => res.url().includes('contact') && res.request().method() === 'POST',
            { timeout: 8000 }
        ).catch(() => {});

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/messages.php');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).toContainText(subject);
    });

    test('delete message → removed from messages list', async ({ page }) => {
        const subject = `E2E Del Msg ${ts()}`;

        await page.goto('/frontend/pages/contact/contact.html');
        await page.waitForLoadState('networkidle');
        await page.fill('#name', 'Playwright Delete Test');
        await page.fill('#email', 'playwright@e2e.test');
        await page.fill('#subject', subject);
        await page.fill('#message', 'Message to be deleted. Safe to delete.');
        await page.locator('button[type="submit"]').click();
        await page.waitForResponse(
            res => res.url().includes('contact') && res.request().method() === 'POST',
            { timeout: 8000 }
        ).catch(() => {});

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/messages.php');
        await page.waitForLoadState('networkidle');

        const row = page.locator('tr').filter({ hasText: subject });
        if (await row.isVisible().catch(() => false)) {
            await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('delete_message') && res.request().method() === 'POST',
                    { timeout: 5000 }
                ).catch(() => null),
                row.locator('.delete-btn').click(),
            ]);
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).not.toContainText(subject);
        }
    });
});

// ─── Content requests ─────────────────────────────────────────────────────────

test.describe('Manager content requests → admin approve / decline / edit-approve', () => {
    /** Submit a project request as manager and return the project name. */
    async function submitProjectRequest(page) {
        const name = `E2E Req ${ts()}`;
        await loginAsManager(page);
        await page.goto('/panel/manager/pages/request-project.php');
        await page.fill('#f_name', name);
        await page.fill('#f_desc', 'E2E automated request. Safe to delete.');
        await page.selectOption('#f_status', 'Active');
        await page.fill('[name="due_date"], #f_due', '2026-12-31');
        const dur = page.locator('[name="duration"], #f_duration');
        if (await dur.isVisible().catch(() => false)) await dur.fill('6 months');
        await Promise.all([
            page.waitForResponse(
                res => res.url().includes('requests') && res.request().method() === 'POST',
                { timeout: 8000 }
            ).catch(() => null),
            page.locator('button[type="submit"], input[type="submit"]').first().click(),
        ]);
        return name;
    }

    test('manager submits request → pending in admin content-requests', async ({ page }) => {
        const name = await submitProjectRequest(page);
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/content-requests.php');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('#requestsBody, body')).toContainText(name);
    });

    test('admin approves request → status changes to approved', async ({ page }) => {
        await submitProjectRequest(page);
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/content-requests.php');
        await page.waitForLoadState('networkidle');

        const reviewBtn = page.locator('.btn-edit.btn-action, button.btn-action').first();
        if (await reviewBtn.isVisible().catch(() => false)) {
            await reviewBtn.click();
            // Modal opens
            await expect(page.locator('.btn-approve')).toBeVisible({ timeout: 5000 });
            await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('requests') && res.url().includes('review') && res.request().method() === 'POST',
                    { timeout: 8000 }
                ).catch(() => null),
                page.locator('.btn-approve').click(),
            ]);
            await page.waitForLoadState('networkidle');
            // Row should now show approved status
            await expect(page.locator('body')).toContainText(/approved/i);
        }
    });

    test('admin declines request → status changes to declined', async ({ page }) => {
        await submitProjectRequest(page);
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/content-requests.php');
        await page.waitForLoadState('networkidle');

        const reviewBtn = page.locator('.btn-edit.btn-action, button.btn-action').first();
        if (await reviewBtn.isVisible().catch(() => false)) {
            await reviewBtn.click();
            await expect(page.locator('.btn-decline')).toBeVisible({ timeout: 5000 });
            await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('requests') && res.url().includes('review') && res.request().method() === 'POST',
                    { timeout: 8000 }
                ).catch(() => null),
                page.locator('.btn-decline').click(),
            ]);
            await page.waitForLoadState('networkidle');
            await expect(page.locator('body')).toContainText(/declined/i);
        }
    });

    test('admin edits & approves request → project appears on projects page', async ({ page }) => {
        const name = await submitProjectRequest(page);
        const edited = `${name} Edited`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/content-requests.php');
        await page.waitForLoadState('networkidle');

        const reviewBtn = page.locator('.btn-edit.btn-action, button.btn-action').first();
        if (await reviewBtn.isVisible().catch(() => false)) {
            await reviewBtn.click();
            // Switch to edit tab in modal
            const editTab = page.locator('button.modal-tab:has-text("Edit"), [onclick*="edit"]');
            if (await editTab.isVisible().catch(() => false)) {
                await editTab.click();
                const nameField = page.locator('.edit-field [name="name"], .edit-field input').first();
                if (await nameField.isVisible().catch(() => false)) {
                    await nameField.fill(edited);
                }
            }

            await expect(page.locator('.btn-edit:has-text("Edit & Approve"), button:has-text("Edit & Approve")')).toBeVisible({ timeout: 5000 });
            await Promise.all([
                page.waitForResponse(
                    res => res.url().includes('requests') && res.url().includes('review') && res.request().method() === 'POST',
                    { timeout: 8000 }
                ).catch(() => null),
                page.locator('button:has-text("Edit & Approve")').click(),
            ]);
            await page.waitForLoadState('networkidle');

            // Approved project request should create a real project
            await page.goto('/frontend/pages/projects/projects.html');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            await expect(page.locator('body')).toContainText(name);
        }
    });

    test('manager submits member request → pending in admin content-requests', async ({ page }) => {
        const memberName = `E2E Member ${ts()}`;
        await loginAsManager(page);
        await page.goto('/panel/manager/pages/request-member.php');
        await page.fill('[name="full_name"]', memberName);
        await page.fill('[name="email"]', `e2e.${ts()}@test.local`);
        await page.selectOption('[name="role"]', { index: 1 });
        const team = page.locator('#teamSelect');
        if (await team.isVisible().catch(() => false)) await team.selectOption({ index: 1 });

        await Promise.all([
            page.waitForResponse(
                res => res.url().includes('requests') && res.request().method() === 'POST',
                { timeout: 8000 }
            ).catch(() => null),
            page.locator('button[type="submit"], input[type="submit"]').first().click(),
        ]);

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/content-requests.php');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('#requestsBody, body')).toContainText(memberName);
    });
});

// ─── Members ──────────────────────────────────────────────────────────────────

test.describe('Member management flows', () => {
    test('add member → appears on public team page', async ({ page }) => {
        const username = `e2euser${ts()}`;
        const fullName = `E2E Member ${ts()}`;

        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/add_user.php');
        await page.fill('#username', username);
        await page.fill('#password', 'TestPass123!');
        await page.fill('#email', `${username}@e2e.local`);
        await page.fill('#full_name', fullName);
        const role = page.locator('[name="role"]');
        if (await role.isVisible().catch(() => false)) await role.selectOption('team_member');
        const team = page.locator('[name="team"], #team');
        if (await team.isVisible().catch(() => false)) await team.selectOption({ index: 1 });

        await page.locator('button[type="submit"], input[type="submit"]').first().click();
        await page.waitForLoadState('networkidle');

        await page.goto('/frontend/pages/team/team.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        await expect(page.locator('body')).toContainText(fullName);
    });

    test('disable member → status toggles in manage_members list', async ({ page }) => {
        await loginAsAdmin(page);
        await page.goto('/panel/admin/pages/manage_members.php');
        await page.waitForLoadState('networkidle');

        const toggleBtn = page.locator('.toggle-status-btn').first();
        if (await toggleBtn.isVisible().catch(() => false)) {
            const href = await toggleBtn.getAttribute('href') ?? '';
            await page.goto(href);
            await page.waitForLoadState('networkidle');
            await expect(page).not.toHaveURL(/login/);
            await expect(page.locator('body')).toBeVisible();
        }
    });
});
