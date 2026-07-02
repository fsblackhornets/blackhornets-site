import type { projects } from "@/lib/db/schema";
import type { Project } from "@/types/project";

type ProjectRow = typeof projects.$inferSelect;

export function mapProjectRow(row: ProjectRow): Project {
	let days_remaining = 0;
	let is_overdue = false;

	if (row.due_date) {
		const diffMs = new Date(row.due_date).getTime() - Date.now();
		const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
		if (diffDays < 0 && row.status !== "Completed") {
			is_overdue = true;
			days_remaining = Math.abs(diffDays);
		} else {
			days_remaining = Math.max(diffDays, 0);
		}
	}

	return {
		...row,
		status: row.status ?? "Active",
		progress: row.progress ?? 0,
		created_at: row.created_at.toISOString(),
		image_url: row.image,
		days_remaining,
		is_overdue,
	};
}
