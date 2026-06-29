import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

test("admin can accept an application", async ({ page }) => {
	const lastName = uniqueName("StatusApplicant").replace(/\s/g, "");

	// Submit application (public form, admin cookie doesn't block it)
	await page.goto("/apply");
	await page.fill("input[name=firstName]", "Status");
	await page.fill("input[name=lastName]", lastName);
	await page.fill("input[name=email]", `${lastName.toLowerCase()}@test.local`);
	await page.fill("input[name=phone]", "+381601234567");
	await page.fill("input[name=studentId]", `SV-${Date.now().toString().slice(-6)}`);
	await page.fill("input[name=faculty]", "Faculty of Mechanical Engineering");
	await page.fill("input[name=major]", "Mechanical Engineering");
	await page.fill("input[name=gpa]", "9.0");
	const yearSelect = page.locator("select[name=academic_year]");
	await yearSelect.selectOption({ index: 1 });
	const yearsInput = page.locator("input[name=years_studying]");
	if (await yearsInput.isVisible()) await yearsInput.fill("3");
	const positionSelect = page.locator("select[name=position]");
	await positionSelect.selectOption({ index: 1 });
	await page.fill("textarea[name=motivation]", "Passionate about Formula Student engineering and motorsport innovation at university level.");
	await page.locator("input[name=resume]").setInputFiles({
		name: "resume.pdf",
		mimeType: "application/pdf",
		buffer: Buffer.from("%PDF-1.4 1 0 obj<</Type/Catalog>>endobj\n%%EOF"),
	});
	await page.getByRole("button", { name: /submit/i }).click();
	await expect(page.getByRole("main").getByText(/submitted successfully/i)).toBeVisible({ timeout: 15000 });

	// Admin opens applications panel and selects the applicant
	await page.goto("/admin/applications");
	const appCard = page.getByText(lastName).first();
	await expect(appCard).toBeVisible({ timeout: 5000 });
	await appCard.click();

	// Click Accept
	await page.getByRole("button", { name: /^accept$/i }).click();

	// Status indicator updates
	await expect(page.getByText(/accepted/i).first()).toBeVisible({ timeout: 8000 });
});
