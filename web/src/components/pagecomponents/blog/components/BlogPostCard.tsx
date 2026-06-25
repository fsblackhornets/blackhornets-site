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

export function BlogPostCard({ post }: { post: Post }) {
	const title = resolvePostTitle(post);
	const body = resolvePostContent(post);
	const imageUrl = buildImageUrl(post.image);
	const date = formatDate(post.created_at);

	return (
		<Link
			href={`/blog/${post.id}`}
			className="group bg-bg-panel rounded-2xl border border-gray-mid overflow-hidden flex flex-col hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
		>
			{imageUrl && (
				<div className="relative h-48 overflow-hidden">
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				</div>
			)}
			<div className="p-5 flex flex-col flex-1 gap-3">
				<div className="flex gap-2 flex-wrap">
					{post.featured === 1 && <Badge variant="gold">Featured</Badge>}
					{post.category && <Badge variant="info">{post.category}</Badge>}
				</div>
				<h2 className="font-heading text-primary text-base tracking-wide leading-snug">
					{title}
				</h2>
				<p className="text-text-gray text-sm leading-relaxed flex-1 line-clamp-3">
					{excerpt(body)}
				</p>
				<div className="flex gap-4 text-xs text-text-gray">
					<span>
						<i className="fa-regular fa-calendar mr-1" aria-hidden="true" />
						{date}
					</span>
					<span>
						<i className="fa-regular fa-user mr-1" aria-hidden="true" />
						{post.author ?? "Team Black Hornets"}
					</span>
				</div>
			</div>
		</Link>
	);
}
