// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Contact form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/frontend/pages/contact/contact.html');
        await page.waitForLoadState('networkidle');
    });

    test('contact form is visible', async ({ page }) => {
        await expect(page.locator('#contactForm')).toBeVisible();
    });

    test('all required fields are present', async ({ page }) => {
        await expect(page.locator('#name')).toBeVisible();
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#subject')).toBeVisible();
        await expect(page.locator('#message')).toBeVisible();
    });

    test('empty submit triggers browser validation', async ({ page }) => {
        await page.locator('#contactForm button[type="submit"], #contactForm input[type="submit"]').click();
        // Browser native validation prevents submission — name field should be invalid
        const nameField = page.locator('#name');
        const valid = await nameField.evaluate(el => el.validity.valid);
        expect(valid).toBe(false);
    });

    test('invalid email triggers validation', async ({ page }) => {
        await page.fill('#name', 'Test User');
        await page.fill('#email', 'not-an-email');
        await page.fill('#subject', 'Test Subject');
        await page.fill('#message', 'Test message body');

        await page.locator('#contactForm button[type="submit"], #contactForm input[type="submit"]').click();

        const emailField = page.locator('#email');
        const valid = await emailField.evaluate(el => el.validity.valid);
        expect(valid).toBe(false);
    });

    test('valid submission shows success or sends request', async ({ page }) => {
        await page.fill('#name', 'Playwright Test');
        await page.fill('#email', 'playwright@test.com');
        await page.fill('#subject', 'E2E Test Message');
        await page.fill('#message', 'This is an automated test message from Playwright.');

        const [request] = await Promise.all([
            page.waitForRequest(req => req.url().includes('contact') && req.method() === 'POST', { timeout: 5000 }).catch(() => null),
            page.locator('#contactForm button[type="submit"], #contactForm input[type="submit"]').click(),
        ]);

        // Either a success message appears or the API request was sent
        const successVisible = await page.locator('.success, .alert-success, [class*="success"]').isVisible().catch(() => false);
        const requestSent = request !== null;

        expect(successVisible || requestSent).toBe(true);
    });
});
