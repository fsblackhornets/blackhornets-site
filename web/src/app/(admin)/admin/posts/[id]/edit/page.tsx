import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePostAction } from "@/app/actions/posts";
import { PostForm } from "@/components/admin/PostForm";
import { SITE_NAME } from "@/constants/site";
import { fetchPost } from "@/lib/api/posts";
import { resolvePostTitle } from "@/lib/utils/utils";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const post = await fetchPost(Number(id));
	return {
		title: `Edit: ${resolvePostTitle(post ?? {})} — ${SITE_NAME} Admin`,
	};
}

export default async function EditPostPage({ params }: Props) {
	const { id } = await params;
	const post = await fetchPost(Number(id));
	if (!post) notFound();

	const action = updatePostAction.bind(null, post.id);

	return (
		<div className="max-w-[720px]">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/posts"
					className="text-text-gray hover:text-primary transition-colors"
				>
					<i className="fas fa-arrow-left" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Edit Post
				</h1>
			</div>
			<PostForm action={action} post={post} />
		</div>
	);
}
