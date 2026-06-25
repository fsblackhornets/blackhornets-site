export const NAV_LINKS = [
	{ href: "/team", label: "Team", icon: "fas fa-users" },
	{ href: "/about", label: "About", icon: "fas fa-info-circle" },
	{ href: "/projects", label: "Projects", icon: "fas fa-project-diagram" },
	{ href: "/gallery", label: "Gallery", icon: "fas fa-images" },
	{ href: "/sponsors", label: "Sponsors", icon: "fas fa-handshake" },
	{ href: "/contact", label: "Contact", icon: "fas fa-envelope" },
] as const;

export const SOCIAL_LINKS = [
	{
		href: "https://www.facebook.com",
		icon: "fab fa-facebook-f",
		label: "Facebook",
	},
	{
		href: "https://www.instagram.com/blackhornets.ns/",
		icon: "fab fa-instagram",
		label: "Instagram",
	},
	{
		href: "https://www.linkedin.com",
		icon: "fab fa-linkedin-in",
		label: "LinkedIn",
	},
	{
		href: "https://www.youtube.com",
		icon: "fab fa-youtube",
		label: "YouTube",
	},
] as const;

export const QUICK_LINKS = [
	{ href: "/about", label: "About" },
	{ href: "/projects", label: "Projects" },
	{ href: "/team", label: "Team" },
	{ href: "/contact", label: "Contact" },
] as const;
