import Link from "next/link";
import { togglePostStatusAction } from "@/app/actions/posts";
import { StatusBadge } from "@/components/ui/components/Badge";
import { Button } from "@/components/ui/components/Button";
import { Switch } from "@/components/ui/components/Switch";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAllPosts } from "@/lib/api/posts";
import { formatDate, resolvePostTitle } from "@/lib/utils/utils";
import { PostDeleteButton } from "./PostDeleteButton";

export const metadata = buildAdminMeta("Posts");

export default async function PostsPage() {
	const posts = await fetchAllPosts();

	return (
		<div className="max-w-[1000px]">
			<div className="flex items-center gap-3 mb-6">
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Posts
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<Button href="/admin/posts/new" size="sm">
					<i className="fas fa-plus" aria-hidden="true" />
					New Post
				</Button>
			</div>

			{posts.length === 0 ? (
				<div className="bg-[#111] border border-primary/12 rounded-2xl p-16 text-center text-text-gray">
					<i
						className="fas fa-newspaper text-4xl text-primary/30 mb-4 block"
						aria-hidden="true"
					/>
					No posts yet.
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-[#111] border border-primary/12 rounded-xl px-5 py-4 flex items-center gap-4"
						>
							<div className="flex-1 min-w-0">
								<p className="text-text-light font-semibold text-sm truncate">
									{resolvePostTitle(post)}
								</p>
								<div className="flex gap-3 mt-1 text-xs text-text-gray">
									{post.category && <span>{post.category}</span>}
									<span>{formatDate(post.created_at)}</span>
									{post.author && <span>by {post.author}</span>}
								</div>
							</div>

							<StatusBadge status={post.status} />

							<form
								action={async () => {
									"use server";
									await togglePostStatusAction(post.id);
								}}
							>
								<Switch
									checked={post.status === "published"}
									onCheckedChange={() => {}}
									label={`Toggle ${resolvePostTitle(post)}`}
								/>
								<button type="submit" className="sr-only">
									Toggle
								</button>
							</form>

							<div className="flex gap-2 shrink-0">
								<Link
									href={`/admin/posts/${post.id}/edit`}
									className="text-text-gray hover:text-primary transition-colors text-sm px-2"
								>
									<i className="fas fa-pen" aria-hidden="true" />
								</Link>
								<PostDeleteButton id={post.id} title={resolvePostTitle(post)} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
