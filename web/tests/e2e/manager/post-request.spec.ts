import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("manager submits post request → success + pending in queue", async ({ page }) => {
	const title = uniqueName("Test Post");

	await page.goto("/manager/requests/new/post");
	await page.context().addCookies([
		{ name: "NEXT_LOCALE", value: "en", domain: "localhost", path: "/" },
	]);
	await page.reload();

	await page.fill("input[name=title_sr]", title);
	await page.fill("input[name=title_en]", `${title} EN`);

	const editor = page.locator(".tiptap").first();
	await editor.click();
	await editor.pressSequentially("E2E post content body.");

	const categorySelect = page.locator("select[name=category]");
	if (await categorySelect.isVisible()) {
		await categorySelect.selectOption({ index: 1 });
	}

	await page.getByRole("button", { name: /submit/i }).click();

	await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 10000 });

	await page.goto("/manager/requests");
	await expect(page.getByText(title)).toBeVisible();
});
