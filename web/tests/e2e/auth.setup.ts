import { test as setup } from "@playwright/test";

import { ADMIN_STATE, MANAGER_STATE, TEST_PASSWORD } from "./helpers";

async function loginAs(
	page: import("@playwright/test").Page,
	username: string,
	storageState: string,
) {
	await page.goto("/login");
	await page
		.context()
		.addCookies([
			{ name: "NEXT_LOCALE", value: "en", domain: "localhost", path: "/" },
		]);
	await page.fill("input[name=username]", username);
	await page.fill("input[name=password]", TEST_PASSWORD);
	await page.getByRole("button", { name: /sign in/i }).click();
	await page.waitForURL(/\/(manager|admin)/);
	await page.context().storageState({ path: storageState });
}

setup("auth: manager login", async ({ page }) => {
	await loginAs(page, "test_manager", MANAGER_STATE);
});

setup("auth: admin login", async ({ page }) => {
	await loginAs(page, "test_admin", ADMIN_STATE);
});
