import Image from "next/image";
import Link from "next/link";
import {
	buildImageUrl,
	excerpt,
	formatDate,
	resolvePostContent,
	resolvePostTitle,
} from "@/lib/utils/utils";
import type { Post } from "@/types/post";

export function BlogPostCard({ post }: { post: Post }) {
	const title = resolvePostTitle(post);
	const body = resolvePostContent(post);
	const imageUrl = buildImageUrl(post.image);
	const date = formatDate(post.created_at);

	return (
		<Link
			href={`/blog/${post.id}`}
			className="group bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 overflow-hidden flex flex-col hover:border-primary/60 transition-colors duration-200"
		>
			{/* Image */}
			{imageUrl && (
				<div className="relative h-48 overflow-hidden shrink-0">
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					{/* Featured badge */}
					{post.featured === 1 && (
						<div className="absolute top-2 left-2">
							<span
								className="font-heading text-[6px] tracking-[2px] uppercase bg-primary text-black px-2 py-0.5"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
								}}
							>
								Featured
							</span>
						</div>
					)}
					{/* Category badge */}
					{post.category && (
						<div className="absolute bottom-2 left-2">
							<span
								className="font-body font-medium text-[6px] tracking-[1.5px] uppercase text-primary bg-primary/10 px-2 py-0.5"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
								}}
							>
								{post.category}
							</span>
						</div>
					)}
				</div>
			)}

			<div className="p-5 flex flex-col flex-1 gap-2.5">
				<h2 className="font-heading text-[#e0e0e0] text-[10px] tracking-wide leading-snug">
					{title}
				</h2>
				<p className="text-text-gray text-[10px] leading-relaxed flex-1 line-clamp-3 font-body">
					{excerpt(body)}
				</p>

				{/* Footer */}
				<div className="flex items-center justify-between border-t border-[#1c1c1c] pt-2 mt-auto gap-2">
					<div className="flex gap-3 text-[9px] text-text-gray font-body flex-wrap">
						<span className="flex items-center gap-1">
							<svg
								width="9"
								height="9"
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
							{date}
						</span>
						<span className="flex items-center gap-1">
							<svg
								width="9"
								height="9"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
							{post.author ?? "Team Black Hornets"}
						</span>
					</div>
					<span className="font-heading text-[7px] tracking-[1px] text-primary/50 shrink-0">
						Read ›
					</span>
				</div>
			</div>
		</Link>
	);
}
