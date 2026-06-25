import type { DashboardStats } from "@/lib/api/admin";

export const ADMIN_NAV = [
	{
		section: "Overview",
		items: [{ href: "/admin", icon: "fas fa-home", label: "Dashboard" }],
	},
	{
		section: "Content",
		items: [
			{ href: "/admin/posts", icon: "fas fa-newspaper", label: "Posts" },
			{ href: "/admin/gallery", icon: "fas fa-images", label: "Gallery" },
			{ href: "/admin/sponsors", icon: "fas fa-handshake", label: "Sponsors" },
			{
				href: "/admin/projects",
				icon: "fas fa-project-diagram",
				label: "Projects",
			},
		],
	},
	{
		section: "Team",
		items: [
			{ href: "/admin/members", icon: "fas fa-users", label: "Members" },
			{
				href: "/admin/applications",
				icon: "fas fa-file-alt",
				label: "Applications",
			},
		],
	},
	{
		section: "Communication",
		items: [
			{ href: "/admin/messages", icon: "fas fa-envelope", label: "Messages" },
			{ href: "/admin/requests", icon: "fas fa-inbox", label: "Requests" },
		],
	},
] as const;

export const TEAM_BREAKDOWN: {
	key: keyof DashboardStats["team_members"];
	label: string;
}[] = [
	{ key: "mechanical", label: "Mechanical" },
	{ key: "electrical", label: "Electrical" },
	{ key: "business", label: "Business" },
];

export const STAT_CARDS: {
	key: keyof Pick<
		DashboardStats,
		"pending_applications" | "total_messages" | "pending_requests"
	>;
	label: string;
	icon: string;
	href: string;
	sub: string;
}[] = [
	{
		key: "pending_applications",
		label: "Pending Applications",
		icon: "fas fa-file-alt",
		href: "/admin/applications",
		sub: "Awaiting review",
	},
	{
		key: "total_messages",
		label: "Messages",
		icon: "fas fa-envelope",
		href: "/admin/messages",
		sub: "In inbox",
	},
	{
		key: "pending_requests",
		label: "Pending Requests",
		icon: "fas fa-inbox",
		href: "/admin/requests",
		sub: "From managers",
	},
];

export const QUICK_ACTIONS = [
	{
		href: "/admin/members/new",
		icon: "fas fa-user-plus",
		label: "Add User",
		desc: "Create a new team member account",
	},
	{
		href: "/admin/posts/new",
		icon: "fas fa-newspaper",
		label: "Add Post",
		desc: "Publish a news or blog article",
	},
	{
		href: "/admin/gallery",
		icon: "fas fa-images",
		label: "Gallery",
		desc: "Manage photo gallery",
	},
	{
		href: "/admin/applications",
		icon: "fas fa-file-alt",
		label: "Applications",
		desc: "Review applicants",
	},
	{
		href: "/admin/sponsors",
		icon: "fas fa-handshake",
		label: "Sponsors",
		desc: "Manage sponsor listings",
	},
	{
		href: "/admin/projects",
		icon: "fas fa-project-diagram",
		label: "Projects",
		desc: "Manage racing projects",
	},
] as const;
