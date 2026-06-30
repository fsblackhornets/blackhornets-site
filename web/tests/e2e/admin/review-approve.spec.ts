import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

// Admin has manager rights, so admin can submit the request then approve it.
test("admin approves post request → approved + visible on public posts", async ({
	page,
}) => {
	const title = uniqueName("Approve Test Post");

	// Submit request as admin (admin can access /manager routes)
	await page.goto("/manager/requests/new/post");
	await page.fill("input[name=title_sr]", title);
	await page.fill("input[name=title_en]", `${title} EN`);

	const editor = page.locator(".tiptap").first();
	await editor.click();
	await editor.pressSequentially("Approval test body content.");

	const categorySelect = page.locator("select[name=category]");
	if (await categorySelect.isVisible()) {
		await categorySelect.selectOption({ index: 1 });
	}

	await page.getByRole("button", { name: /submit/i }).click();
	await expect(page.getByText(/request submitted/i)).toBeVisible({
		timeout: 10000,
	});

	// Find the pending request in admin queue
	await page.goto("/admin/requests");
	const requestLink = page
		.getByRole("link", { name: new RegExp(title, "i") })
		.first();
	await expect(requestLink).toBeVisible({ timeout: 5000 });
	await requestLink.click();

	// Approve
	await page.getByRole("button", { name: /approve/i }).click();

	// Redirects back to /admin/requests
	await page.waitForURL(/\/admin\/requests$/);

	// Request now shows approved status
	await expect(page.getByText(title)).toBeVisible();
});
