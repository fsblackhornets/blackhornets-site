import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("manager submits project request → success + pending in queue", async ({ page }) => {
	const name = uniqueName("Test Project");

	await page.goto("/manager/requests/new/project");

	await page.fill("input[name=name]", name);

	const descInput = page.locator("textarea[name=description], input[name=description]").first();
	if (await descInput.isVisible()) {
		await descInput.fill("E2E project description.");
	}

	const statusSelect = page.locator("select[name=status]");
	if (await statusSelect.isVisible()) {
		await statusSelect.selectOption({ index: 1 });
	}

	const dueDateInput = page.locator("input[name=due_date]");
	if (await dueDateInput.isVisible()) {
		await dueDateInput.fill("2026-12-31");
	}

	const durationInput = page.locator("input[name=duration]");
	if (await durationInput.isVisible()) {
		await durationInput.fill("3 months");
	}

	await page.getByRole("button", { name: /submit/i }).click();

	await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 10000 });

	await page.goto("/manager/requests");
	await expect(page.getByText(name)).toBeVisible();
});
