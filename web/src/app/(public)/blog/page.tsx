import type { Metadata } from "next";
import { BlogPageClient } from "@/components/pagecomponents/blog/BlogPageClient";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";
import { fetchAllPosts } from "@/lib/api/posts";

export const metadata: Metadata = {
	title: `Blog — ${SITE_NAME}`,
	description:
		"Latest news and updates from Black Hornets Racing. Follow our Formula Student journey, engineering insights, and team achievements.",
	openGraph: {
		title: `Blog — ${SITE_NAME}`,
		description: "Latest news and updates from Black Hornets Racing.",
		type: "website",
		siteName: SITE_NAME,
		images: [{ url: SITE_OG_IMAGE }],
	},
};

export default async function BlogPage() {
	const posts = await fetchAllPosts();

	return (
		<>
			<section className="relative py-28 flex items-center justify-center bg-gradient-to-br from-black to-bg-panel overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at center, rgba(255,215,0,0.05) 0%, transparent 70%)",
					}}
				/>
				<div className="relative z-10 text-center px-8">
					<h1 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[4px] text-primary drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">
						Latest News & Updates
					</h1>
					<p className="text-text-light text-xl tracking-widest mt-4">
						Stay updated with our latest achievements and innovations
					</p>
					<div className="w-24 h-0.5 bg-primary mx-auto mt-4" />
				</div>
			</section>

			<section className="py-16">
				<BlogPageClient posts={posts} />
			</section>
		</>
	);
}
