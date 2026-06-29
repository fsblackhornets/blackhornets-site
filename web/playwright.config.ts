import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: "list",
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
		extraHTTPHeaders: {},
	},
	projects: [
		{
			name: "setup",
			testMatch: /auth\.setup\.ts/,
		},
		{
			name: "manager",
			testMatch: /manager\/.+\.spec\.ts/,
			dependencies: ["setup"],
			use: {
				...devices["Desktop Chrome"],
				storageState: "tests/.auth/manager.json",
				extraHTTPHeaders: {
					Cookie: "NEXT_LOCALE=en",
				},
			},
		},
		{
			name: "admin",
			testMatch: /admin\/.+\.spec\.ts/,
			dependencies: ["setup"],
			use: {
				...devices["Desktop Chrome"],
				storageState: "tests/.auth/admin.json",
				extraHTTPHeaders: {
					Cookie: "NEXT_LOCALE=en",
				},
			},
		},
		{
			name: "public",
			testMatch: /public\/.+\.spec\.ts/,
			use: {
				...devices["Desktop Chrome"],
				extraHTTPHeaders: {
					Cookie: "NEXT_LOCALE=en",
				},
			},
		},
	],
	webServer: {
		command: "npm run dev",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},
});
