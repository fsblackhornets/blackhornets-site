export const MEMBER_ROLES = [
	"team_member",
	"sub_leader",
	"team_leader",
	"project_leader",
] as const;

export const MEMBER_TEAMS = [
	"mechanical",
	"electrical",
	"operating_business",
] as const;

export const MEMBER_ROLE_OPTIONS = MEMBER_ROLES.map((r) => ({
	value: r,
	label: r.replace(/_/g, " "),
}));

export const MEMBER_TEAM_OPTIONS = MEMBER_TEAMS.map((t) => ({
	value: t,
	label: t.replace(/_/g, " "),
}));

export type MemberRole = (typeof MEMBER_ROLES)[number];
export type MemberTeam = (typeof MEMBER_TEAMS)[number];

export interface AdminMember {
	id: number;
	username: string;
	email: string;
	full_name: string;
	role: MemberRole | "admin" | "manager";
	team: string | null;
	department: string | null;
	phone: string | null;
	study_field: string | null;
	position: string | null;
	profile_picture: string;
	status: "active" | "inactive";
	created_at: string;
}
