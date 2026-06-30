import { expect, test } from "@playwright/test";

// Public project extraHTTPHeaders sets Cookie: "NEXT_LOCALE=en" → starts in English.
// Locale toggle button shows the *other* locale ("SR" when en, "EN" when sr).
test("locale toggle switches nav text EN → SR", async ({ page }) => {
	await page.goto("/");

	// Current locale is English — button shows "SR"
	const toggleBtn = page.getByRole("button", { name: /^sr$/i }).first();
	await expect(toggleBtn).toBeVisible({ timeout: 5000 });

	// English nav text visible
	await expect(
		page.getByRole("link", { name: /^home$/i }).first(),
	).toBeVisible();

	// Switch to Serbian
	await toggleBtn.click();
	await page.waitForLoadState("networkidle");

	// Now Serbian — button shows "EN"
	await expect(page.getByRole("button", { name: /^en$/i }).first()).toBeVisible(
		{ timeout: 5000 },
	);

	// Serbian nav text visible
	await expect(
		page.getByRole("link", { name: /^početna$/i }).first(),
	).toBeVisible();
});
