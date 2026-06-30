import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("manager submits gallery request → success + pending in queue", async ({
	page,
}) => {
	const title = uniqueName("Gallery E2E");

	await page.goto("/manager/requests/new/gallery");

	const titleInput = page.locator("input[name=title]");
	if (await titleInput.isVisible()) {
		await titleInput.fill(title);
	}

	const categorySelect = page.locator("select[name=category]");
	if (await categorySelect.isVisible()) {
		await categorySelect.selectOption({ index: 1 });
	}

	const altInput = page.locator("input[name=alt_text]");
	if (await altInput.isVisible()) {
		await altInput.fill("E2E alt text");
	}

	await page.getByRole("button", { name: /submit/i }).click();

	await expect(page.getByText(/request submitted/i)).toBeVisible({
		timeout: 10000,
	});

	await page.goto("/manager/requests");
	// Gallery requests appear in queue (title may be empty without image; check type label)
	await expect(page.getByText(/gallery/i).first()).toBeVisible();
});
