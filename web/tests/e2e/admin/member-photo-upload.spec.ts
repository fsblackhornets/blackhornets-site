import { expect, test } from "@playwright/test";
import { uniqueName } from "../helpers";

// 1x1 transparent PNG
const TINY_PNG = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
	"base64",
);

test("admin uploads profile picture on create → photo visible; update → photo persists", async ({
	page,
}) => {
	const name = uniqueName("Photo Upload Member");

	// --- Create member with photo ---
	await page.goto("/admin/members/new");
	await page.fill("input[name=full_name]", name);

	await page.locator("input[name=profile_picture]").setInputFiles({
		name: "avatar.png",
		mimeType: "image/png",
		buffer: TINY_PNG,
	});
	await expect(page.getByText("avatar.png")).toBeVisible();

	await page.getByRole("button", { name: /create member/i }).click();
	await page.waitForURL(/\/admin\/members$/, { timeout: 10000 });

	// Photo <img> visible in list (not initials fallback)
	await expect(page.getByAltText(name)).toBeVisible({ timeout: 5000 });

	// Edit link is a preceding sibling of the delete button in the same actions div
	await page
		.locator(
			`xpath=//button[@aria-label="Delete ${name}"]/preceding-sibling::a`,
		)
		.click();
	await page.waitForURL(/\/admin\/members\/\d+\/edit$/);

	// "Keep current" confirms profile_picture is set in DB
	await expect(page.getByText(/keep current/i)).toBeVisible();

	// --- Update with new photo ---
	await page.locator("input[name=profile_picture]").setInputFiles({
		name: "avatar2.png",
		mimeType: "image/png",
		buffer: TINY_PNG,
	});
	await expect(page.getByText("avatar2.png")).toBeVisible();

	await page.getByRole("button", { name: /save changes/i }).click();
	await page.waitForURL(/\/admin\/members$/, { timeout: 10000 });

	// Photo still shown after update
	await expect(page.getByAltText(name)).toBeVisible({ timeout: 5000 });

	// --- Cleanup ---
	await page
		.getByRole("button", { name: new RegExp(`delete ${name}`, "i") })
		.click();
	await page.getByRole("button", { name: /^delete$/i }).click();
	await expect(page.getByAltText(name)).not.toBeVisible({ timeout: 5000 });
});
