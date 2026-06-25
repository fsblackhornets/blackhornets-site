export interface TeamMember {
	id: number;
	full_name: string;
	role:
		| "admin"
		| "team_member"
		| "sub_leader"
		| "team_leader"
		| "project_leader";
	team: string | null;
	department: string | null;
	email: string;
	study_field: string | null;
	phone: string | null;
	profile_picture: string | null;
	faculty?: string | null;
	academic_year?: number | null;
}

export interface TeamData {
	success: boolean;
	members: TeamMember[];
	organized_data: Record<string, TeamMember[]>;
	team_leader: TeamMember | null;
	mechanical_project_leader: TeamMember | null;
	electrical_project_leader: TeamMember | null;
	business_project_leader: TeamMember | null;
}
