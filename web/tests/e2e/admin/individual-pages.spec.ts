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
	await expect(page.getByText(/request submitted/i)).toBeVisible({
		timeout: 10000,
	});

	await page.goto("/admin/requests");
	const link = page
		.getByRole("link", { name: new RegExp(identifier, "i") })
		.first();
	await expect(link).toBeVisible({ timeout: 5000 });
	await link.click();
	await page.getByRole("button", { name: /approve/i }).click();
	await page.waitForURL(/\/admin\/requests$/, { timeout: 8000 });
}

test("/blog/[id] renders post title on detail page", async ({ page }) => {
	const titleEn = uniqueName("Detail Post");

	await submitAndApprove(
		page,
		"/manager/requests/new/post",
		async (p) => {
			await p.fill("input[name=title_sr]", `${titleEn} SR`);
			await p.fill("input[name=title_en]", titleEn);
			const editor = p.locator(".tiptap").first();
			await editor.click();
			await editor.pressSequentially("Individual page test content.");
			const categorySelect = p.locator("select[name=category]");
			if (await categorySelect.isVisible())
				await categorySelect.selectOption({ index: 1 });
		},
		titleEn,
	);

	// Navigate to /blog and click the post card
	await page.goto("/blog");
	const postLink = page
		.getByRole("link", { name: new RegExp(titleEn, "i") })
		.first();
	await expect(postLink).toBeVisible({ timeout: 8000 });
	await postLink.click();

	// Detail page renders title in h1
	await expect(page.locator("h1")).toContainText(titleEn, {
		ignoreCase: true,
		timeout: 8000,
	});
});

test("/projects/[id] renders project name on detail page", async ({ page }) => {
	const name = uniqueName("Detail Project");

	await submitAndApprove(
		page,
		"/manager/requests/new/project",
		async (p) => {
			await p.fill("input[name=name]", name);
			await p
				.fill(
					"textarea[name=description], input[name=description]",
					"Detail page E2E project.",
				)
				.catch(() => {});
			const statusSelect = p.locator("select[name=status]");
			if (await statusSelect.isVisible())
				await statusSelect.selectOption({ index: 1 });
			await p.fill("input[name=due_date]", "2027-06-01");
			await p.fill("input[name=duration]", "4 months");
		},
		name,
	);

	// Navigate to /projects and click the project card
	await page.goto("/projects");
	const projectLink = page
		.getByRole("link", { name: new RegExp(name, "i") })
		.first();
	await expect(projectLink).toBeVisible({ timeout: 8000 });
	await projectLink.click();

	// Detail page renders project name in h1
	await expect(page.locator("h1")).toContainText(name, {
		ignoreCase: true,
		timeout: 8000,
	});
});
