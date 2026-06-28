import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/constants/site";
import { fetchAllPosts, fetchPost } from "@/lib/api/posts";
import {
	buildImageUrl,
	formatDate,
	resolvePostContent,
	resolvePostTitle,
} from "@/lib/utils/utils";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const post = await fetchPost(Number(id));
	if (!post) return { title: `Post — ${SITE_NAME}` };

	return {
		title: `${resolvePostTitle(post)} — ${SITE_NAME}`,
		description: resolvePostContent(post).slice(0, 160) || undefined,
	};
}

export default async function BlogPostPage({ params }: Props) {
	const { id } = await params;
	const [post, allPosts] = await Promise.all([
		fetchPost(Number(id)),
		fetchAllPosts(),
	]);
	if (!post) notFound();

	const title = resolvePostTitle(post);
	const content = resolvePostContent(post);
	const imageUrl = buildImageUrl(post.image);
	const readTime = Math.ceil(content.split(" ").length / 200);
	const related = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

	// Parse h2 headings for ToC
	const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/g) ?? [];
	const headings = h2Matches.map((h) => h.replace(/<[^>]+>/g, "").trim());

	const tags = [post.category, "Formula Student", "Racing"].filter(
		Boolean,
	) as string[];
	const authorInitial = (post.author ?? "T").charAt(0).toUpperCase();

	return (
		<div className="max-w-screen-2xl mx-auto px-4 py-16">
			{/* Back link */}
			<Link
				href="/blog"
				className="inline-flex items-center gap-2 font-heading text-[8px] tracking-[3px] uppercase text-primary mb-7 hover:opacity-70 transition-opacity"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#ffd700"
					strokeWidth={2.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
				Back to Blog
			</Link>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-0">
				{/* ── Main column ── */}
				<div className="lg:pr-12 lg:border-r lg:border-[#1a1a1a]">
					{/* Badges */}
					<div className="flex gap-2 flex-wrap mb-4">
						{post.featured === 1 && (
							<span
								className="font-heading text-[7px] tracking-[2px] uppercase bg-primary text-black px-2.5 py-1.5"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
								}}
							>
								Featured
							</span>
						)}
						{post.category && (
							<span
								className="font-body text-[7px] tracking-[1.5px] uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-1.5"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
								}}
							>
								{post.category}
							</span>
						)}
					</div>

					{/* Title */}
					<h1 className="font-heading text-[clamp(1.6rem,4vw,2.4rem)] text-primary uppercase tracking-[1px] leading-tight mb-5">
						{title}
					</h1>

					{/* Meta row */}
					<div className="flex items-center gap-4 flex-wrap border-b border-[#1a1a1a] pb-5 mb-7">
						{/* Author */}
						<div className="flex items-center gap-2">
							<div
								className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center shrink-0"
								style={{ background: "rgba(255,215,0,0.08)" }}
							>
								<span className="font-heading text-[10px] text-primary">
									{authorInitial}
								</span>
							</div>
							<span className="font-body text-xs text-text-gray">
								{post.author ?? "Team Black Hornets"}
							</span>
						</div>

						<div className="w-px h-6 bg-[#222]" />

						{/* Date */}
						<span className="flex items-center gap-1.5 font-body text-xs text-text-gray">
							<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
								<line x1="16" y1="2" x2="16" y2="6" />
								<line x1="8" y1="2" x2="8" y2="6" />
								<line x1="3" y1="10" x2="21" y2="10" />
							</svg>
							{formatDate(post.created_at)}
						</span>

						<div className="w-px h-6 bg-[#222]" />

						{/* Read time */}
						<span className="flex items-center gap-1.5 font-body text-xs text-text-gray">
							<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 16 14" />
							</svg>
							{readTime} min read
						</span>

						{post.views > 0 && (
							<>
								<div className="w-px h-6 bg-[#222]" />
								<span className="flex items-center gap-1.5 font-body text-xs text-text-gray">
									<svg
										width="11"
										height="11"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										aria-hidden="true"
									>
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
										<circle cx="12" cy="12" r="3" />
									</svg>
									{post.views.toLocaleString()}
								</span>
							</>
						)}
					</div>

					{/* Hero image */}
					{imageUrl && (
						<div className="relative mb-10 border border-[#222]">
							<div className="relative h-72 overflow-hidden">
								<Image
									src={imageUrl}
									alt={title}
									fill
									className="object-cover"
									priority
								/>
							</div>
							<div
								className="absolute bottom-0 inset-x-0 h-[2px]"
								style={{
									background:
										"linear-gradient(90deg, #ffd700, rgba(255,215,0,0.1))",
								}}
							/>
						</div>
					)}

					{/* Prose */}
					<div
						className="prose prose-invert prose-yellow max-w-none text-text-light leading-relaxed
							[&_h2]:font-heading [&_h2]:text-white [&_h2]:uppercase [&_h2]:tracking-[2px] [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2.5 [&_h2]:before:content-[''] [&_h2]:before:w-[3px] [&_h2]:before:h-5 [&_h2]:before:bg-primary [&_h2]:before:flex-shrink-0
							[&_h3]:font-heading [&_h3]:text-primary
							[&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:bg-primary/[0.04] [&_blockquote]:rounded-none [&_blockquote]:px-5 [&_blockquote]:py-4
							[&_img]:rounded-none [&_img]:border [&_img]:border-[#1e1e1e]
							[&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-primary/30 [&_a]:hover:border-primary"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted CMS content
						dangerouslySetInnerHTML={{ __html: content }}
					/>

					{/* Tags + Share row */}
					<div className="flex items-center justify-between flex-wrap gap-3 pt-5 mt-8 border-t border-[#1a1a1a]">
						<div className="flex items-center gap-2 flex-wrap">
							<span
								className="font-heading text-[7px] tracking-[3px] uppercase"
								style={{ color: "#444" }}
							>
								Tags:
							</span>
							{tags.map((tag) => (
								<span
									key={tag}
									className="font-heading text-[6.5px] tracking-[1.5px] uppercase text-primary/60 bg-primary/5 border border-primary/10 px-2 py-1"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									}}
								>
									{tag}
								</span>
							))}
						</div>
						<div className="flex items-center gap-2">
							{/* Facebook */}
							<button
								type="button"
								aria-label="Share on Facebook"
								className="w-[30px] h-[30px] rounded-full border border-primary/20 flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
								</svg>
							</button>
							{/* Instagram */}
							<button
								type="button"
								aria-label="Share on Instagram"
								className="w-[30px] h-[30px] rounded-full border border-primary/20 flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									aria-hidden="true"
								>
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
								</svg>
							</button>
							{/* Copy link */}
							<button
								type="button"
								aria-label="Copy link"
								className="w-[30px] h-[30px] rounded-full border border-primary/20 flex items-center justify-center text-text-gray hover:border-primary hover:text-primary transition-colors"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									aria-hidden="true"
								>
									<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
									<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
								</svg>
							</button>
						</div>
					</div>

					{/* Related posts */}
					{related.length > 0 && (
						<div className="mt-14">
							<div className="flex items-center gap-4 mb-6">
								<div className="flex-1 h-px bg-[#1a1a1a]" />
								<span
									className="font-heading text-[7px] tracking-[4px] uppercase"
									style={{ color: "#333" }}
								>
									More Articles
								</span>
								<div className="flex-1 h-px bg-[#1a1a1a]" />
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{related.map((rel) => {
									const relTitle = resolvePostTitle(rel);
									const relImage = buildImageUrl(rel.image);
									return (
										<Link
											key={rel.id}
											href={`/blog/${rel.id}`}
											className="group bg-bg-dark border border-[#1e1e1e] border-t-2 border-t-primary/35 rounded-sm overflow-hidden hover:border-primary/40 transition-colors"
										>
											{relImage && (
												<div className="relative h-16 overflow-hidden">
													<Image
														src={relImage}
														alt={relTitle}
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-105"
													/>
												</div>
											)}
											<div className="p-3">
												<p className="font-body text-[9px] text-text-gray mb-1">
													{formatDate(rel.created_at)}
												</p>
												<p className="font-heading text-[9px] tracking-[0.5px] text-[#e0e0e0] leading-snug line-clamp-2">
													{relTitle}
												</p>
											</div>
										</Link>
									);
								})}
							</div>
						</div>
					)}
				</div>

				{/* ── Sidebar ── */}
				<aside className="hidden lg:block lg:pl-8">
					<div className="sticky top-24 flex flex-col gap-5">
						{/* Author card */}
						<div className="bg-bg-dark border border-[#1e1e1e] border-l-2 border-l-primary rounded-sm p-4">
							<div className="flex items-center gap-3 mb-3">
								<div
									className="w-9 h-9 rounded-full border border-primary/30 flex items-center justify-center shrink-0"
									style={{ background: "rgba(255,215,0,0.08)" }}
								>
									<span className="font-heading text-sm text-primary font-bold">
										{authorInitial}
									</span>
								</div>
								<div>
									<p className="font-heading text-[9px] tracking-[1px] text-[#e0e0e0]">
										{post.author ?? "Team Black Hornets"}
									</p>
									<p className="font-body text-[8px] text-text-gray mt-0.5">
										Black Hornets Racing
									</p>
								</div>
							</div>
							<p className="font-body text-[9px] text-text-gray leading-relaxed">
								Formula Student team dedicated to engineering excellence and
								motorsport innovation.
							</p>
						</div>

						{/* Table of contents */}
						{headings.length > 0 && (
							<div className="bg-bg-dark border border-[#1e1e1e] rounded-sm p-4">
								<p className="font-heading text-[7px] tracking-[4px] uppercase text-primary mb-3">
									Contents
								</p>
								<div className="flex flex-col gap-2">
									{headings.map((heading, i) => (
										<div key={heading} className="flex items-center gap-2">
											{i === 0 ? (
												<div className="w-[2px] h-[14px] bg-primary shrink-0" />
											) : (
												<div className="w-[2px] h-[14px] bg-[#2a2a2a] shrink-0" />
											)}
											<span
												className="font-body text-[9px] leading-snug"
												style={{ color: i === 0 ? "#aaaaaa" : "#444" }}
											>
												{heading}
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Share */}
						<div className="bg-bg-dark border border-[#1e1e1e] rounded-sm p-4">
							<p className="font-heading text-[7px] tracking-[4px] uppercase text-primary mb-3">
								Share
							</p>
							<div className="flex flex-col gap-1">
								{[
									{
										label: "Facebook",
										icon: (
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="currentColor"
												aria-hidden="true"
											>
												<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
											</svg>
										),
									},
									{
										label: "Instagram",
										icon: (
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												aria-hidden="true"
											>
												<rect
													x="2"
													y="2"
													width="20"
													height="20"
													rx="5"
													ry="5"
												/>
												<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
												<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
											</svg>
										),
									},
									{
										label: "Copy Link",
										icon: (
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												aria-hidden="true"
											>
												<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
												<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
											</svg>
										),
									},
								].map(({ label, icon }) => (
									<button
										key={label}
										type="button"
										aria-label={label}
										className="flex items-center gap-2.5 p-2.5 bg-bg-dark border border-[#1e1e1e] rounded-sm text-text-gray hover:text-primary hover:border-primary/30 transition-colors"
									>
										{icon}
										<span className="font-body text-[9px]">{label}</span>
									</button>
								))}
							</div>
						</div>

						{/* Join the Team CTA */}
						<div
							className="rounded-sm p-4 text-center border border-primary/12"
							style={{ background: "rgba(255,215,0,0.04)" }}
						>
							<p className="font-heading text-[9px] tracking-[3px] uppercase text-primary mb-2">
								Join the Team
							</p>
							<p className="font-body text-[9px] text-text-gray leading-relaxed mb-4">
								Be part of Black Hornets Racing. Apply and build the future of
								motorsport.
							</p>
							<Link
								href="/apply"
								className="inline-block font-heading text-[7px] tracking-[2px] uppercase text-black bg-primary px-4 py-2 hover:bg-yellow-400 transition-colors"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 7px) 0, 100% 100%, 7px 100%)",
								}}
							>
								Apply Now
							</Link>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
