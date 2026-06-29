import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("manager submits member request → success + pending in queue", async ({ page }) => {
	const fullName = uniqueName("E2E Member");

	await page.goto("/manager/requests/new/member");

	await page.fill("input[name=full_name]", fullName);
	await page.fill("input[name=email]", `e2e_${Date.now()}@test.local`);

	const phoneInput = page.locator("input[name=phone]");
	if (await phoneInput.isVisible()) {
		await phoneInput.fill("+381601234567");
	}

	const positionInput = page.locator("input[name=position]");
	if (await positionInput.isVisible()) {
		await positionInput.fill("Engineer");
	}

	const roleSelect = page.locator("select[name=role]");
	if (await roleSelect.isVisible()) {
		await roleSelect.selectOption({ index: 1 });
	}

	const teamSelect = page.locator("select[name=team]");
	if (await teamSelect.isVisible()) {
		await teamSelect.selectOption({ index: 1 });
	}

	await page.getByRole("button", { name: /submit/i }).click();

	await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 10000 });

	await page.goto("/manager/requests");
	await expect(page.getByText(fullName)).toBeVisible();
});
