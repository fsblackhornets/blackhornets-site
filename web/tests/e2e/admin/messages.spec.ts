import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("contact form submission appears in admin messages panel", async ({
	page,
}) => {
	const subject = uniqueName("E2E Subject");

	// Submit contact form (public page — admin cookie doesn't block it)
	await page.goto("/contact");
	await page.fill("input[name=name]", "E2E Admin Tester");
	await page.fill("input[name=email]", "e2eadmin@test.local");
	await page.fill("input[name=subject]", subject);
	await page.fill(
		"textarea[name=message]",
		"Automated E2E message for admin panel check.",
	);
	await page.getByRole("button", { name: /send/i }).click();
	await expect(page.getByRole("main").getByText(/message sent/i)).toBeVisible({
		timeout: 10000,
	});

	// Verify it appears in admin messages panel
	await page.goto("/admin/messages");
	await expect(page.getByText(subject)).toBeVisible({ timeout: 5000 });
});
