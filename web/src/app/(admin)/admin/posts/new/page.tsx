import type { Metadata } from "next";
import Link from "next/link";
import { createPostAction } from "@/app/actions/posts";
import { PostForm } from "@/components/admin/PostForm";
import { SITE_NAME } from "@/constants/site";

export const metadata: Metadata = { title: `New Post — ${SITE_NAME} Admin` };

export default function NewPostPage() {
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
					New Post
				</h1>
			</div>
			<PostForm action={createPostAction} />
		</div>
	);
}
