import Link from "next/link";
import { togglePostStatusAction } from "@/app/actions/posts";
import { StatusBadge } from "@/components/ui/components/Badge";
import { ParaButton } from "@/components/ui/components/ParaButton";
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
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Posts
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<span className="font-body text-[8.5px] text-[#444]">
					{posts.length} total
				</span>
				<ParaButton
					href="/admin/posts/new"
					size="sm"
					icon={
						<svg
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					}
				>
					New Post
				</ParaButton>
			</div>

			{posts.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<svg
						className="mx-auto mb-4"
						width="36"
						height="36"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(255,215,0,.2)"
						strokeWidth={1.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
						<polyline points="14 2 14 8 20 8" />
						<line x1="16" y1="13" x2="8" y2="13" />
						<line x1="16" y1="17" x2="8" y2="17" />
						<polyline points="10 9 9 9 8 9" />
					</svg>
					<p className="font-heading text-[9px] tracking-[3px] uppercase text-[#333]">
						No posts yet.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{posts.map((post) => (
						<div
							key={post.id}
							className="bg-[#111] border border-[#1e1e1e] border-l-[2px] border-l-primary/20 rounded-sm px-5 py-4 flex items-center gap-4 hover:border-l-primary/60 transition-colors"
						>
							<div className="flex-1 min-w-0">
								<p className="font-body font-semibold text-[10px] text-[#e0e0e0] truncate">
									{resolvePostTitle(post)}
								</p>
								<div className="flex gap-3 mt-1 font-body text-[8px] text-[#444]">
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
									label={`Toggle ${resolvePostTitle(post)}`}
								/>
								<button type="submit" className="sr-only">
									Toggle
								</button>
							</form>

							<div className="flex gap-2 shrink-0">
								<Link
									href={`/admin/posts/${post.id}/edit`}
									className="text-[#444] hover:text-primary transition-colors p-1"
									aria-label="Edit post"
								>
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
									</svg>
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
