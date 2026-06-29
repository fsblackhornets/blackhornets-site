import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { updatePostAction } from "@/app/actions/posts";
import { PostForm } from "@/components/forms/posts/PostForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchPost } from "@/lib/api/posts";
import { resolvePostTitle } from "@/lib/utils/utils";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	const post = await fetchPost(Number(id));
	return buildAdminMeta("Posts", `Edit: ${resolvePostTitle(post ?? {})}`);
}

export default async function EditPostPage({ params }: Props) {
	const { id } = await params;
	const post = await fetchPost(Number(id));
	if (!post) notFound();

	const action = updatePostAction.bind(null, post.id);

	return (
		<div className="max-w-none">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/posts"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<ChevronLeft size={16} strokeWidth={2} stroke="#ffd700" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Edit Post
				</h1>
			</div>
			<PostForm action={action} post={post} />
		</div>
	);
}
