import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createPostAction } from "@/app/actions/posts";
import { PostForm } from "@/components/forms/posts/PostForm";
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
					<ChevronLeft
						size={16}
						strokeWidth={2}
						stroke="#ffd700"
						aria-hidden="true"
					/>
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					New Post
				</h1>
			</div>
			<PostForm action={createPostAction} />
		</div>
	);
}
