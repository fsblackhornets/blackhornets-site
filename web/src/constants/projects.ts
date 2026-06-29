export const PROJECT_STATUS_OPTIONS = [
	{ value: "Active", label: "Active" },
	{ value: "Pending", label: "Pending" },
	{ value: "Completed", label: "Completed" },
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number]["value"];

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
	Active: "text-green-400 border-green-400/30",
	Pending: "text-yellow-400 border-yellow-400/30",
	Completed: "text-blue-400 border-blue-400/30",
};
