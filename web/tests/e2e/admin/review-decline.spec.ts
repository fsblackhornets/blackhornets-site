import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("admin declines request with notes → status declined, not on public site", async ({
	page,
}) => {
	const title = uniqueName("Decline Test Post");

	// Submit request
	await page.goto("/manager/requests/new/post");
	await page.fill("input[name=title_sr]", title);
	await page.fill("input[name=title_en]", `${title} EN`);

	const editor = page.locator(".tiptap").first();
	await editor.click();
	await editor.pressSequentially("Decline test body content.");

	const categorySelect = page.locator("select[name=category]");
	if (await categorySelect.isVisible()) {
		await categorySelect.selectOption({ index: 1 });
	}

	await page.getByRole("button", { name: /submit/i }).click();
	await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 10000 });

	// Navigate to admin review
	await page.goto("/admin/requests");
	const requestLink = page.getByRole("link", { name: new RegExp(title, "i") }).first();
	await expect(requestLink).toBeVisible({ timeout: 5000 });
	await requestLink.click();

	// Add admin notes
	const notesTextarea = page.locator("textarea").first();
	if (await notesTextarea.isVisible()) {
		await notesTextarea.fill("E2E decline reason.");
	}

	// Click the decline button (shows confirm)
	await page.getByRole("button", { name: /decline/i }).first().click();

	// Confirm decline
	await page.getByRole("button", { name: /decline/i }).last().click();

	await page.waitForURL(/\/admin\/requests$/);

	// Content should NOT appear on public posts page
	await page.goto("/posts");
	await expect(page.getByText(title)).not.toBeVisible();
});
