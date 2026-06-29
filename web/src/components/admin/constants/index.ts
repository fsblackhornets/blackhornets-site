import type { LucideIcon } from "lucide-react";
import {
	FileText,
	Handshake,
	Home,
	Images,
	Inbox,
	Mail,
	Network,
	Newspaper,
	Users,
} from "lucide-react";
import type { DashboardStats } from "@/lib/api/admin";

export const ADMIN_NAV: {
	section: string;
	items: { href: string; Icon: LucideIcon; label: string }[];
}[] = [
	{
		section: "Overview",
		items: [{ href: "/admin", Icon: Home, label: "Dashboard" }],
	},
	{
		section: "Content",
		items: [
			{ href: "/admin/posts", Icon: Newspaper, label: "Posts" },
			{ href: "/admin/gallery", Icon: Images, label: "Gallery" },
			{ href: "/admin/sponsors", Icon: Handshake, label: "Sponsors" },
			{ href: "/admin/projects", Icon: Network, label: "Projects" },
		],
	},
	{
		section: "Team",
		items: [
			{ href: "/admin/members", Icon: Users, label: "Members" },
			{ href: "/admin/applications", Icon: FileText, label: "Applications" },
		],
	},
	{
		section: "Communication",
		items: [
			{ href: "/admin/messages", Icon: Mail, label: "Messages" },
			{ href: "/admin/requests", Icon: Inbox, label: "Requests" },
		],
	},
];

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
