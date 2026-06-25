export interface Project {
	id: number;
	name: string;
	description: string | null;
	status: string;
	due_date: string | null;
	duration: string | null;
	progress: number;
	image: string | null;
	image_url: string | null;
	days_remaining: number;
	is_overdue: boolean;
	created_at: string;
}
