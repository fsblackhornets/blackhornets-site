import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/components/Badge";
import {
	buildImageUrl,
	excerpt,
	formatDate,
	resolvePostContent,
	resolvePostTitle,
} from "@/lib/utils/utils";
import type { Post } from "@/types/post";

export function NewsCard({
	post,
	variant = "small",
}: {
	post: Post;
	variant?: "featured" | "small";
}) {
	const title = resolvePostTitle(post);
	const body = resolvePostContent(post);
	const imageUrl = buildImageUrl(post.image);
	const date = formatDate(post.created_at);

	if (variant === "featured") {
		return (
			<article
				className="relative overflow-hidden flex"
				style={{
					minHeight: "320px",
					border: "1px solid rgba(255,215,0,0.2)",
					background: "#1a1a1a",
				}}
			>
				{/* Background image with gradient overlay */}
				{imageUrl && (
					<div className="absolute inset-0" style={{ right: "48px" }}>
						<Image src={imageUrl} alt={title} fill className="object-cover" />
						<div
							className="absolute inset-0"
							style={{
								background:
									"linear-gradient(90deg, rgba(8,8,8,0.95) 35%, rgba(8,8,8,0.3) 100%)",
							}}
						/>
					</div>
				)}

				{/* FEATURED vertical sidebar */}
				<div
					className="absolute top-0 bottom-0 right-0 flex items-center justify-center z-10"
					style={{ width: "48px", background: "#ffd700" }}
				>
					<span
						className="font-heading font-black text-black text-xs tracking-[0.3em]"
						style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
					>
						FEATURED
					</span>
				</div>

				{/* Content */}
				<div
					className="relative z-10 flex flex-col justify-end p-8"
					style={{ paddingRight: "72px" }}
				>
					<div className="flex items-center gap-3 mb-3 flex-wrap">
						{post.category && <Badge variant="info">{post.category}</Badge>}
						<span className="text-text-gray text-xs font-body">
							<i className="fa-regular fa-calendar mr-1" aria-hidden="true" />
							{date}
						</span>
					</div>
					<h3
						className="font-heading font-black text-white mb-3"
						style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
					>
						{title}
					</h3>
					<p className="text-text-gray text-sm leading-relaxed mb-4 max-w-2xl">
						{excerpt(body)}
					</p>
					<Link
						href={`/blog/${post.id}`}
						className="text-primary font-heading font-bold text-sm tracking-wider hover:underline self-start"
					>
						Read More →
					</Link>
				</div>
			</article>
		);
	}

	return (
		<article
			className="overflow-hidden flex flex-col"
			style={{
				border: "1px solid rgba(255,215,0,0.15)",
				background: "#1a1a1a",
			}}
		>
			{imageUrl && (
				<div className="relative overflow-hidden" style={{ height: "200px" }}>
					<Image src={imageUrl} alt={title} fill className="object-cover" />
				</div>
			)}
			<div className="p-5 flex flex-col flex-1 gap-3">
				<div className="flex gap-2 flex-wrap">
					{post.category && <Badge variant="info">{post.category}</Badge>}
				</div>
				<div className="flex gap-4 text-text-gray text-xs">
					<span>
						<i className="fa-regular fa-calendar mr-1" aria-hidden="true" />
						{date}
					</span>
					<span>
						<i className="fa-regular fa-user mr-1" aria-hidden="true" />
						{post.author ?? "Team Black Hornets"}
					</span>
				</div>
				<h3 className="font-heading text-base text-primary">{title}</h3>
				<p className="text-text-gray text-sm leading-relaxed flex-1">
					{excerpt(body)}
				</p>
				<Link
					href={`/blog/${post.id}`}
					className="text-primary text-sm font-semibold hover:underline self-start"
				>
					Read More →
				</Link>
			</div>
		</article>
	);
}
