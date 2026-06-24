export const PROJECT_STATUS_CLASSES = {
	active: "active",
	completed: "completed",
	pending: "pending",
};

export const PROJECT_PROGRESS_COLORS = [
	{ min: 80, color: "#4CAF50" },
	{ min: 60, color: "#FF9800" },
	{ min: 40, color: "#FFC107" },
	{ min: 0, color: "#F44336" },
];

if (typeof window !== "undefined") {
	window.PROJECT_STATUS_CLASSES = PROJECT_STATUS_CLASSES;
	window.PROJECT_PROGRESS_COLORS = PROJECT_PROGRESS_COLORS;
}
