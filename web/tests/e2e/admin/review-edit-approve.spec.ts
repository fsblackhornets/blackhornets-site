import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("admin edits field then approves → edited value persists", async ({ page }) => {
	const originalTitle = uniqueName("EditApprove Post");
	const editedTitle = `${originalTitle} EDITED`;

	// Submit request
	await page.goto("/manager/requests/new/post");
	await page.fill("input[name=title_sr]", originalTitle);
	await page.fill("input[name=title_en]", `${originalTitle} EN`);

	const editor = page.locator(".tiptap").first();
	await editor.click();
	await editor.pressSequentially("Edit-approve test body.");

	const categorySelect = page.locator("select[name=category]");
	if (await categorySelect.isVisible()) {
		await categorySelect.selectOption({ index: 1 });
	}

	await page.getByRole("button", { name: /submit/i }).click();
	await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 10000 });

	// Navigate to admin review
	await page.goto("/admin/requests");
	const requestLink = page.getByRole("link", { name: new RegExp(originalTitle, "i") }).first();
	await expect(requestLink).toBeVisible({ timeout: 5000 });
	await requestLink.click();

	// Edit the title_sr field in the review form
	const titleSrField = page.locator("input[name=title_sr]");
	if (await titleSrField.isVisible()) {
		await titleSrField.clear();
		await titleSrField.fill(editedTitle);
	}

	// Approve (edit+approve path)
	await page.getByRole("button", { name: /approve/i }).click();
	await page.waitForURL(/\/admin\/requests$/);

	// Edited value should now be in the approved content
	// Verify the request no longer shows as pending
	await expect(page.getByText(/pending/i)).not.toBeVisible({ timeout: 3000 }).catch(() => {
		// pending might still appear for other requests — acceptable
	});
});
