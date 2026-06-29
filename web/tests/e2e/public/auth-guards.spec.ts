import { expect, test } from "@playwright/test";

test("unauthed /admin → redirects to /login", async ({ page }) => {
	await page.goto("/admin");
	await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
});

test("unauthed /manager → redirects to /login", async ({ page }) => {
	await page.goto("/manager");
	await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
});
