export const MANAGER_STATE = "tests/.auth/manager.json";
export const ADMIN_STATE = "tests/.auth/admin.json";
export const TEST_PASSWORD = "TestPass123!";

export function uniqueName(prefix: string): string {
	return `${prefix} ${Date.now()}`;
}
