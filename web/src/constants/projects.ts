export const PROJECT_STATUS_OPTIONS = [
	{ value: "Active", label: "Active" },
	{ value: "Pending", label: "Pending" },
	{ value: "Completed", label: "Completed" },
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number]["value"];
