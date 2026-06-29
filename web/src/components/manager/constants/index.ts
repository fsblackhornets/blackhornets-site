export const MANAGER_NAV = [
	{
		section: "Overview",
		items: [{ href: "/manager", icon: "grid", label: "Dashboard" }],
	},
	{
		section: "Content Requests",
		items: [
			{ href: "/manager/requests", icon: "activity", label: "My Requests" },
			{
				href: "/manager/requests/new/post",
				icon: "edit",
				label: "Request Post",
			},
			{
				href: "/manager/requests/new/project",
				icon: "gear",
				label: "Request Project",
			},
			{
				href: "/manager/requests/new/sponsor",
				icon: "heart",
				label: "Request Sponsor",
			},
			{
				href: "/manager/requests/new/member",
				icon: "users",
				label: "Request Member",
			},
			{
				href: "/manager/requests/new/gallery",
				icon: "image",
				label: "Request Gallery",
			},
		],
	},
] as const;

export const QUICK_ACTIONS = [
	{
		href: "/manager/requests/new/post",
		icon: "edit",
		label: "Request Post",
		desc: "Submit a news or blog article for review",
	},
	{
		href: "/manager/requests/new/project",
		icon: "gear",
		label: "Request Project",
		desc: "Propose a new racing project",
	},
	{
		href: "/manager/requests/new/sponsor",
		icon: "heart",
		label: "Request Sponsor",
		desc: "Add a sponsor listing for review",
	},
	{
		href: "/manager/requests/new/member",
		icon: "users",
		label: "Request Member",
		desc: "Propose a new team member",
	},
	{
		href: "/manager/requests/new/gallery",
		icon: "image",
		label: "Request Gallery",
		desc: "Upload race or event photos for gallery",
	},
] as const;
