import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "http", hostname: "localhost" },
			{ protocol: "https", hostname: "**" },
		],
	},
	async redirects() {
		return [
			// Legacy PHP frontend pages
			{
				source: "/frontend/pages/home/:path*",
				destination: "/",
				permanent: true,
			},
			{
				source: "/frontend/pages/about/:path*",
				destination: "/about",
				permanent: true,
			},
			{
				source: "/frontend/pages/team/:path*",
				destination: "/team",
				permanent: true,
			},
			{
				source: "/frontend/pages/projects/:path*",
				destination: "/projects",
				permanent: true,
			},
			{
				source: "/frontend/pages/gallery/:path*",
				destination: "/gallery",
				permanent: true,
			},
			{
				source: "/frontend/pages/sponsors/:path*",
				destination: "/sponsors",
				permanent: true,
			},
			{
				source: "/frontend/pages/blog/:path*",
				destination: "/blog",
				permanent: true,
			},
			{
				source: "/frontend/pages/contact/:path*",
				destination: "/contact",
				permanent: true,
			},
			{
				source: "/frontend/pages/apply/:path*",
				destination: "/apply",
				permanent: true,
			},
			// Legacy PHP admin panel
			{
				source: "/panel/admin/login.php",
				destination: "/login",
				permanent: true,
			},
			{ source: "/panel/admin", destination: "/admin", permanent: true },
			{ source: "/panel/admin/:path*", destination: "/admin", permanent: true },
			// Legacy PHP manager panel
			{
				source: "/panel/manager/login.php",
				destination: "/login",
				permanent: true,
			},
			{
				source: "/panel/manager/:path*",
				destination: "/manager",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
