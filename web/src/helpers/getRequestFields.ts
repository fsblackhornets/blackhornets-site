const EXCLUDED_FIELDS = new Set(["image", "logo", "profile_picture"]);

export function getRequestFields(
	data: Record<string, unknown>,
): [string, unknown][] {
	return Object.entries(data).filter(([key]) => !EXCLUDED_FIELDS.has(key));
}
