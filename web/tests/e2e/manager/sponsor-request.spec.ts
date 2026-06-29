import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("manager submits sponsor request → success + pending in queue", async ({ page }) => {
	const name = uniqueName("Test Sponsor");

	await page.goto("/manager/requests/new/sponsor");

	await page.fill("input[name=name]", name);
	await page.fill("input[name=website]", "https://example.com");
	await page.fill("textarea[name=description_sr]", "Opis sponzora.");
	await page.fill("textarea[name=description_en]", "Sponsor description.");

	const tierSelect = page.locator("select[name=tier]");
	if (await tierSelect.isVisible()) {
		await tierSelect.selectOption({ index: 1 });
	}

	await page.getByRole("button", { name: /submit/i }).click();

	await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 10000 });

	await page.goto("/manager/requests");
	await expect(page.getByText(name)).toBeVisible();
});
