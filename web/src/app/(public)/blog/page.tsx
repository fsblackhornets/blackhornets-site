import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogPageClient } from "@/components/pagecomponents/blog/BlogPageClient";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";
import { fetchAllPosts } from "@/lib/api/posts";
import {
	buildImageUrl,
	excerpt,
	formatDate,
	resolvePostContent,
	resolvePostTitle,
} from "@/lib/utils/utils";

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
	const featuredPost = posts.find((p) => p.featured === 1) ?? null;

	const featuredTitle = featuredPost ? resolvePostTitle(featuredPost) : null;
	const featuredBody = featuredPost ? resolvePostContent(featuredPost) : null;
	const featuredImageUrl = featuredPost
		? buildImageUrl(featuredPost.image)
		: null;
	const featuredDate = featuredPost
		? formatDate(featuredPost.created_at)
		: null;

	return (
		<>
			{/* Hero */}
			<section
				className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden"
				style={{ background: "#080808" }}
			>
				{/* Racing stripe */}
				<div className="absolute top-0 left-0 right-0 z-20 flex h-[3px]">
					<div className="flex-1 bg-primary" />
					<div className="w-[80px] bg-bg-dark" />
					<div className="w-[30px] bg-primary" />
				</div>

				{/* JOURNAL watermark */}
				<div
					className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
					aria-hidden="true"
				>
					<span
						className="font-heading font-black text-white"
						style={{
							fontSize: "160px",
							opacity: 0.03,
							letterSpacing: "0.05em",
							lineHeight: 1,
						}}
					>
						JOURNAL
					</span>
				</div>

				{/* Content */}
				<div className="relative z-10 text-center px-8 flex flex-col items-center">
					<h1 className="font-heading text-[44px] font-black tracking-[3px] uppercase leading-[1.05] flex flex-wrap items-baseline justify-center gap-x-3">
						<span className="text-white">News &amp;</span>
						<span className="bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
							Updates
						</span>
					</h1>

					{/* Speed lines */}
					<div className="flex gap-1.5 items-center my-5">
						<div
							style={{
								width: "52px",
								height: "2px",
								background: "#ffd700",
								opacity: 0.9,
							}}
						/>
						<div
							style={{
								width: "16px",
								height: "1.5px",
								background: "#ffd700",
								opacity: 0.5,
							}}
						/>
						<div
							style={{
								width: "8px",
								height: "1px",
								background: "#ffd700",
								opacity: 0.2,
							}}
						/>
					</div>

					<p className="font-body font-light text-text-gray text-xs tracking-[4px] uppercase">
						Stay updated with our journey
					</p>
				</div>

				{/* Gold bottom border */}
				<div
					className="absolute bottom-0 left-0 right-0 z-20"
					style={{ height: "3px", background: "#ffd700" }}
				/>
			</section>

			{/* Featured post */}
			{featuredPost && featuredTitle && (
				<section className="py-10 px-4 max-w-screen-2xl mx-auto">
					<Link
						href={`/blog/${featuredPost.id}`}
						className="group flex flex-col lg:flex-row rounded-sm border border-[#222] border-t-2 border-t-primary overflow-hidden hover:border-primary/60 transition-colors duration-300"
					>
						{/* Image side */}
						{featuredImageUrl && (
							<div className="relative h-64 lg:h-auto lg:w-[44%] shrink-0 bg-bg-dark overflow-hidden">
								<Image
									src={featuredImageUrl}
									alt={featuredTitle}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									priority
								/>
								{/* Diagonal fade */}
								<div
									className="absolute inset-0 hidden lg:block"
									style={{
										background:
											"linear-gradient(100deg, transparent 44%, var(--color-bg-panel) 56%)",
									}}
								/>
								{/* Featured badge */}
								<div className="absolute top-4 left-4">
									<span
										className="font-heading text-[7px] tracking-[3px] uppercase bg-primary text-black px-2.5 py-1"
										style={{
											clipPath:
												"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
										}}
									>
										Featured
									</span>
								</div>
							</div>
						)}

						{/* Content side */}
						<div className="p-8 flex flex-col gap-4 flex-1 bg-bg-panel">
							{/* Meta row */}
							<div className="flex items-center gap-4 flex-wrap">
								{featuredPost.category && (
									<span
										className="font-heading text-[6.5px] tracking-[2px] uppercase text-primary px-2.5 py-1 bg-primary/10"
										style={{
											clipPath:
												"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
										}}
									>
										{featuredPost.category}
									</span>
								)}
								<span className="font-body text-[10px] text-text-gray">
									{featuredDate}
								</span>
								{featuredPost.views > 0 && (
									<span className="font-body text-[10px] text-text-gray">
										{featuredPost.views} views
									</span>
								)}
							</div>

							<h2 className="font-heading text-[16px] text-primary leading-snug tracking-wide">
								{featuredTitle}
							</h2>

							{featuredBody && (
								<p className="font-body text-text-gray text-sm leading-relaxed line-clamp-3">
									{excerpt(featuredBody)}
								</p>
							)}

							{/* Author */}
							<div className="flex items-center gap-3">
								<div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
									<span className="font-heading text-[9px] text-primary font-bold">
										{(featuredPost.author ?? "T").charAt(0).toUpperCase()}
									</span>
								</div>
								<span className="font-body text-[10px] text-text-gray">
									{featuredPost.author ?? "Team Black Hornets"}
								</span>
							</div>

							<div className="mt-auto pt-2">
								<span className="font-heading text-[8px] tracking-[2px] uppercase text-primary">
									Read Full Article ›
								</span>
							</div>
						</div>
					</Link>
				</section>
			)}

			<section className="py-16">
				<BlogPageClient posts={posts} />
			</section>
		</>
	);
}
