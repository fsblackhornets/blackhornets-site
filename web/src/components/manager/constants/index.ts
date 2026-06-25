export const MANAGER_NAV = [
	{
		section: "Overview",
		items: [{ href: "/manager", icon: "fas fa-home", label: "Dashboard" }],
	},
	{
		section: "Content Requests",
		items: [
			{
				href: "/manager/requests",
				icon: "fas fa-inbox",
				label: "My Requests",
			},
			{
				href: "/manager/requests/new/post",
				icon: "fas fa-newspaper",
				label: "Request Post",
			},
			{
				href: "/manager/requests/new/project",
				icon: "fas fa-project-diagram",
				label: "Request Project",
			},
			{
				href: "/manager/requests/new/sponsor",
				icon: "fas fa-handshake",
				label: "Request Sponsor",
			},
			{
				href: "/manager/requests/new/member",
				icon: "fas fa-user-plus",
				label: "Request Member",
			},
		],
	},
] as const;

export const QUICK_ACTIONS = [
	{
		href: "/manager/requests/new/post",
		icon: "fas fa-newspaper",
		label: "Request Post",
		desc: "Submit a news or blog article for review",
	},
	{
		href: "/manager/requests/new/project",
		icon: "fas fa-project-diagram",
		label: "Request Project",
		desc: "Propose a new racing project",
	},
	{
		href: "/manager/requests/new/sponsor",
		icon: "fas fa-handshake",
		label: "Request Sponsor",
		desc: "Add a sponsor listing for review",
	},
	{
		href: "/manager/requests/new/member",
		icon: "fas fa-user-plus",
		label: "Request Member",
		desc: "Propose a new team member",
	},
] as const;
