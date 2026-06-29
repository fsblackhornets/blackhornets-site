import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

// Admin has access to both /manager and /admin routes.
// Flow: submit post → admin declines → navigate manager queue → resubmit → back to pending.
test("manager resubmits a declined post request", async ({ page }) => {
	const title = uniqueName("Resubmit Post");

	// Submit post request
	await page.goto("/manager/requests/new/post");
	await page.fill("input[name=title_sr]", title);
	await page.fill("input[name=title_en]", `${title} EN`);
	const editor = page.locator(".tiptap").first();
	await editor.click();
	await editor.pressSequentially("Resubmit test content.");
	const categorySelect = page.locator("select[name=category]");
	if (await categorySelect.isVisible()) await categorySelect.selectOption({ index: 1 });
	await page.getByRole("button", { name: /submit for review/i }).click();
	await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 10000 });

	// Admin declines it
	await page.goto("/admin/requests");
	const link = page.getByRole("link", { name: new RegExp(title, "i") }).first();
	await expect(link).toBeVisible({ timeout: 5000 });
	await link.click();
	// First click shows confirmation; second click confirms the decline
	await page.getByRole("button", { name: /decline/i }).first().click();
	await page.getByRole("button", { name: /decline/i }).last().click();
	await page.waitForURL(/\/admin\/requests$/, { timeout: 8000 });

	// Manager queue: request shows as declined with "Edit & Resubmit"
	await page.goto("/manager/requests");
	const resubmitLink = page.getByRole("link", { name: /edit.*resubmit/i }).first();
	await expect(resubmitLink).toBeVisible({ timeout: 5000 });
	await resubmitLink.click();

	// Resubmit form: update title and submit
	await page.waitForURL(/\/manager\/requests\/\d+\/resubmit/, { timeout: 5000 });
	const titleSrInput = page.locator("input[name=title_sr]");
	await titleSrInput.fill(`${title} v2`);
	await page.getByRole("button", { name: /submit/i }).click();

	// Redirects to /manager/requests; updated request is pending
	await page.waitForURL(/\/manager\/requests$/, { timeout: 8000 });
	await expect(page.getByText(/pending/i).first()).toBeVisible({ timeout: 5000 });
});
