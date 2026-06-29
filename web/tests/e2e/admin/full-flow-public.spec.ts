import { expect, test } from "@playwright/test";

import { uniqueName } from "../helpers";

async function submitAndApprove(
	page: import("@playwright/test").Page,
	formUrl: string,
	fill: (page: import("@playwright/test").Page) => Promise<void>,
	identifier: string,
) {
	await page.goto(formUrl);
	await fill(page);
	await page.getByRole("button", { name: /submit for review/i }).click();
	await expect(page.getByText(/request submitted/i)).toBeVisible({ timeout: 10000 });

	await page.goto("/admin/requests");
	const link = page.getByRole("link", { name: new RegExp(identifier, "i") }).first();
	await expect(link).toBeVisible({ timeout: 5000 });
	await link.click();

	await page.getByRole("button", { name: /approve/i }).click();
	await page.waitForURL(/\/admin\/requests$/);
}

test("full flow: project → approve → visible on /projects", async ({ page }) => {
	const name = uniqueName("Flow Project");

	await submitAndApprove(
		page,
		"/manager/requests/new/project",
		async (p) => {
			await p.fill("input[name=name]", name);
			await p.fill("textarea[name=description], input[name=description]", "Full flow E2E project.").catch(() => {});
			const statusSelect = p.locator("select[name=status]");
			if (await statusSelect.isVisible()) await statusSelect.selectOption({ index: 1 });
			await p.fill("input[name=due_date]", "2027-01-01");
			await p.fill("input[name=duration]", "6 months");
		},
		name,
	);

	await page.goto("/projects");
	await expect(page.getByText(name)).toBeVisible({ timeout: 8000 });
});

test("full flow: sponsor → approve → visible on /sponsors", async ({ page }) => {
	const name = uniqueName("Flow Sponsor");

	await submitAndApprove(
		page,
		"/manager/requests/new/sponsor",
		async (p) => {
			await p.fill("input[name=name]", name);
			await p.fill("input[name=website]", "https://e2e-sponsor.example.com");
			await p.fill("textarea[name=description_sr]", "E2E sponsor opis.");
			await p.fill("textarea[name=description_en]", "E2E sponsor description.");
			const tierSelect = p.locator("select[name=tier]");
			if (await tierSelect.isVisible()) await tierSelect.selectOption({ index: 1 });
		},
		name,
	);

	await page.goto("/sponsors");
	await expect(page.getByText(name).first()).toBeVisible({ timeout: 8000 });
});

test("full flow: member → approve → visible on /team", async ({ page }) => {
	const fullName = uniqueName("Flow Member");

	await submitAndApprove(
		page,
		"/manager/requests/new/member",
		async (p) => {
			await p.fill("input[name=full_name]", fullName);
			await p.fill("input[name=email]", `flowmember_${Date.now()}@test.local`);
			const roleSelect = p.locator("select[name=role]");
			if (await roleSelect.isVisible()) await roleSelect.selectOption({ index: 1 });
			const teamSelect = p.locator("select[name=team]");
			if (await teamSelect.isVisible()) await teamSelect.selectOption({ index: 1 });
		},
		fullName,
	);

	await page.goto("/team");
	// Page shows team cards; click "See Team Members" in the Mechanical Engineering section
	const mechSection = page.locator("div").filter({ hasText: /^Mechanical Engineering/ }).first();
	await mechSection.getByRole("button", { name: /see team members/i }).click();
	await expect(page.getByText(fullName)).toBeVisible({ timeout: 8000 });
});
