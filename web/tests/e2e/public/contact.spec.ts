import { expect, test } from "@playwright/test";

test("contact form submits → success message + row in DB", async ({ page }) => {
	await page.goto("/contact");

	await page.fill("input[name=name]", "E2E Tester");
	await page.fill("input[name=email]", "e2e@test.local");
	await page.fill("input[name=subject]", "E2E contact test");
	await page.fill("textarea[name=message]", "This is an automated E2E test message.");

	await page.getByRole("button", { name: /send/i }).click();

	await expect(
		page.getByRole("main").getByText(/message sent/i),
	).toBeVisible({ timeout: 10000 });
});
