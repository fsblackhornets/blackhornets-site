import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/components/Badge";
import { SITE_NAME } from "@/constants/site";
import { fetchPost } from "@/lib/api/posts";
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
	const post = await fetchPost(Number(id));
	if (!post) notFound();

	const title = resolvePostTitle(post);
	const content = resolvePostContent(post);
	const imageUrl = buildImageUrl(post.image);

	return (
		<div className="max-w-[800px] mx-auto px-4 py-16">
			<Link
				href="/blog"
				className="inline-flex items-center gap-2 text-primary font-heading text-sm tracking-widest hover:underline mb-10"
			>
				<i className="fas fa-arrow-left" aria-hidden="true" />
				Back to Blog
			</Link>

			{/* Badges */}
			<div className="flex gap-2 flex-wrap mb-4">
				{post.featured === 1 && <Badge variant="gold">Featured</Badge>}
				{post.category && <Badge variant="info">{post.category}</Badge>}
			</div>

			<h1 className="font-heading text-[clamp(1.8rem,5vw,3rem)] text-primary tracking-wide mb-4">
				{title}
			</h1>

			<div className="flex gap-6 text-sm text-text-gray mb-8">
				<span>
					<i className="fa-regular fa-calendar mr-1" aria-hidden="true" />
					{formatDate(post.created_at)}
				</span>
				<span>
					<i className="fa-regular fa-user mr-1" aria-hidden="true" />
					{post.author ?? "Team Black Hornets"}
				</span>
			</div>

			{imageUrl && (
				<div className="relative h-72 rounded-2xl overflow-hidden mb-10 border border-gray-mid">
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-cover"
						priority
					/>
				</div>
			)}

			<div
				className="prose prose-invert prose-yellow max-w-none text-text-light leading-relaxed
					[&_h2]:font-heading [&_h2]:text-primary [&_h2]:tracking-wide
					[&_h3]:font-heading [&_h3]:text-primary
					[&_a]:text-primary [&_a]:underline
					[&_img]:rounded-xl [&_img]:border [&_img]:border-gray-mid"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted CMS content
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</div>
	);
}
