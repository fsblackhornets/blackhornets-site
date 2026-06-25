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

export function NewsCard({ post }: { post: Post }) {
	const title = resolvePostTitle(post);
	const body = resolvePostContent(post);
	const imageUrl = buildImageUrl(post.image);
	const date = formatDate(post.created_at);

	return (
		<article className="bg-bg-dark rounded-xl border border-gray-mid overflow-hidden flex flex-col">
			{imageUrl && (
				<div className="relative h-56 overflow-hidden">
					<Image src={imageUrl} alt={title} fill className="object-cover" />
				</div>
			)}
			<div className="p-5 flex flex-col flex-1 gap-3">
				<div className="flex gap-2 flex-wrap">
					{post.featured === 1 && <Badge variant="gold">Featured</Badge>}
					{post.category && <Badge variant="info">{post.category}</Badge>}
				</div>
				<div className="flex gap-4 text-text-gray text-sm">
					<span>
						<i className="fa-regular fa-calendar mr-1" aria-hidden="true" />
						{date}
					</span>
					<span>
						<i className="fa-regular fa-user mr-1" aria-hidden="true" />
						{post.author ?? "Team Black Hornets"}
					</span>
				</div>
				<h3 className="font-heading text-lg text-primary">{title}</h3>
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
