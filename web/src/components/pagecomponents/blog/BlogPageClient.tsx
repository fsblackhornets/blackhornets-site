"use client";

import { useBlogFilter } from "@/hooks/blog/useBlogFilter";
import type { Post } from "@/types/post";
import { BlogPostCard } from "./components/BlogPostCard";

export function BlogPageClient({ posts }: { posts: Post[] }) {
	const { pagePosts, search, page, totalPages, handleSearch, setPage } =
		useBlogFilter(posts);

	return (
		<>
			{/* Search */}
			<div className="max-w-[600px] mx-auto px-4 mb-10">
				<form
					onSubmit={(e) => e.preventDefault()}
					className="flex gap-2 bg-bg-panel border border-gray-mid rounded-xl overflow-hidden"
				>
					<input
						type="text"
						value={search}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="Search posts..."
						className="flex-1 bg-transparent px-4 py-3 text-text-light placeholder:text-text-gray outline-none text-sm"
					/>
					<button
						type="submit"
						className="px-4 text-primary hover:text-primary/70 transition-colors"
						aria-label="Search"
					>
						<i className="fas fa-search" aria-hidden="true" />
					</button>
				</form>
			</div>

			{/* Grid */}
			<div className="max-w-[1100px] mx-auto px-4">
				{pagePosts.length === 0 ? (
					<p className="text-center text-text-gray py-20">No posts found.</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{pagePosts.map((post) => (
							<BlogPostCard key={post.id} post={post} />
						))}
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center gap-2 mt-10">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
							<button
								key={p}
								type="button"
								onClick={() => setPage(p)}
								className={`w-9 h-9 rounded-lg font-heading text-sm transition-colors ${
									p === page
										? "bg-primary text-bg-dark"
										: "border border-gray-mid text-text-gray hover:border-primary hover:text-primary"
								}`}
							>
								{p}
							</button>
						))}
					</div>
				)}
			</div>
		</>
	);
}
