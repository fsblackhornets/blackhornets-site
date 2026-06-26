import { AboutIcon } from "@/components/icons/AboutIcon";
import { BlogIcon } from "@/components/icons/BlogIcon";
import { ContactIcon } from "@/components/icons/ContactIcon";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { GalleryIcon } from "@/components/icons/GalleryIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { ProjectsIcon } from "@/components/icons/ProjectsIcon";
import { SponsorsIcon } from "@/components/icons/SponsorsIcon";
import { TeamIcon } from "@/components/icons/TeamIcon";
import { YouTubeIcon } from "@/components/icons/YouTubeIcon";

export const NAV_LINKS = [
	{ href: "/team", label: "Team", Icon: TeamIcon },
	{ href: "/about", label: "About", Icon: AboutIcon },
	{ href: "/projects", label: "Projects", Icon: ProjectsIcon },
	{ href: "/blog", label: "Blog", Icon: BlogIcon },
	{ href: "/gallery", label: "Gallery", Icon: GalleryIcon },
	{ href: "/sponsors", label: "Sponsors", Icon: SponsorsIcon },
	{ href: "/contact", label: "Contact", Icon: ContactIcon },
];

export const SOCIAL_LINKS = [
	{ href: "https://www.facebook.com", Icon: FacebookIcon, label: "Facebook" },
	{ href: "https://www.instagram.com/blackhornets.ns/", Icon: InstagramIcon, label: "Instagram" },
	{ href: "https://www.linkedin.com", Icon: LinkedInIcon, label: "LinkedIn" },
	{ href: "https://www.youtube.com", Icon: YouTubeIcon, label: "YouTube" },
];

export const QUICK_LINKS = [
	{ href: "/about", label: "About" },
	{ href: "/projects", label: "Projects" },
	{ href: "/blog", label: "Blog" },
	{ href: "/team", label: "Team" },
	{ href: "/sponsors", label: "Sponsors" },
	{ href: "/contact", label: "Contact" },
] as const;
