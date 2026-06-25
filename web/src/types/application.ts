export interface Application {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	student_id: string;
	faculty: string;
	major: string;
	academic_year: number;
	gpa: number;
	desired_position: string;
	experience: string | null;
	motivation: string;
	resume_path: string;
	status: "pending" | "reviewing" | "accepted" | "rejected";
	created_at: string;
	updated_at: string;
}

export type ApplicationStatus = Application["status"];
