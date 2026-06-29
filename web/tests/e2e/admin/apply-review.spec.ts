import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

// Admin storageState is loaded but /apply is public — cookie doesn't block it.
test("application form submits → appears in admin applications panel", async ({ page }) => {
	const firstName = "E2E";
	const lastName = uniqueName("Applicant").replace(/\s/g, "");

	await page.goto("/apply");

	await page.fill("input[name=firstName]", firstName);
	await page.fill("input[name=lastName]", lastName);
	await page.fill("input[name=email]", `${lastName.toLowerCase()}@test.local`);
	await page.fill("input[name=phone]", "+381601234567");
	await page.fill("input[name=studentId]", "SV-123456");
	await page.fill("input[name=faculty]", "Faculty of Mechanical Engineering");
	await page.fill("input[name=major]", "Mechanical Engineering");
	await page.fill("input[name=gpa]", "8.5");

	// academic_year select
	const yearSelect = page.locator("select[name=academic_year]");
	await yearSelect.selectOption({ index: 1 });

	// years_studying input
	const yearsInput = page.locator("input[name=years_studying]");
	if (await yearsInput.isVisible()) {
		await yearsInput.fill("2");
	}

	// position select
	const positionSelect = page.locator("select[name=position]");
	await positionSelect.selectOption({ index: 1 });

	await page.fill("textarea[name=motivation]", "I want to join because I am passionate about Formula Student.");

	// Upload a minimal PDF (Playwright creates it in-memory)
	await page.locator("input[name=resume]").setInputFiles({
		name: "resume.pdf",
		mimeType: "application/pdf",
		buffer: Buffer.from("%PDF-1.4 1 0 obj<</Type/Catalog>>endobj\n%%EOF"),
	});

	await page.getByRole("button", { name: /submit/i }).click();

	await expect(page.getByRole("main").getByText(/submitted successfully/i)).toBeVisible({ timeout: 15000 });

	// Verify it appears in admin applications panel
	await page.goto("/admin/applications");
	await expect(page.getByText(lastName).first()).toBeVisible({ timeout: 5000 });
});
