import { expect, test } from "@playwright/test";

// Manager session cannot access admin routes — proxy redirects to /manager.
test("manager session /admin → redirects to /manager", async ({ page }) => {
	await page.goto("/admin");
	await expect(page).toHaveURL(/\/manager/, { timeout: 8000 });
});
