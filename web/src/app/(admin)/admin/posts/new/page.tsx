import Link from "next/link";
import { createPostAction } from "@/app/actions/posts";
import { PostForm } from "@/components/admin/PostForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";

export const metadata = buildAdminMeta("Posts", "New Post");

export default function NewPostPage() {
	return (
		<div className="max-w-none">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/posts"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#ffd700"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					New Post
				</h1>
			</div>
			<PostForm action={createPostAction} />
		</div>
	);
}
