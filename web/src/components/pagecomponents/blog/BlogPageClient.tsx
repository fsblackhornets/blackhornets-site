"use client";

import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { useBlogFilter } from "@/hooks/blog/useBlogFilter";
import type { Post } from "@/types/post";
import { BlogPostCard } from "./components/BlogPostCard";

export function BlogPageClient({ posts }: { posts: Post[] }) {
	const t = useTranslations("blog");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const categories = useMemo(() => {
		const cats = posts.map((p) => p.category).filter(Boolean) as string[];
		return ["All", ...Array.from(new Set(cats))];
	}, [posts]);

	const categoryFiltered = useMemo(() => {
		if (!selectedCategory || selectedCategory === "All") return posts;
		return posts.filter((p) => p.category === selectedCategory);
	}, [posts, selectedCategory]);

	const { pagePosts, search, page, totalPages, handleSearch, setPage } =
		useBlogFilter(categoryFiltered);

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div className="max-w-screen-2xl mx-auto px-4">
			{/* Search */}
			<div className="max-w-2xl mx-auto mb-6">
				<form
					onSubmit={(e) => e.preventDefault()}
					className="flex bg-bg-panel border border-[#242424] overflow-hidden"
				>
					<div className="flex items-center gap-3 flex-1 px-4">
						<SearchIcon className="w-[14px] h-[14px] shrink-0 text-[rgba(255,215,0,.35)]" />
						<input
							type="text"
							value={search}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder={t("search.placeholder")}
							className="flex-1 bg-transparent py-3 text-text-light placeholder:text-[#444] outline-none text-sm font-body"
						/>
					</div>
					<button
						type="submit"
						className="font-heading text-[7px] tracking-[2px] uppercase text-black bg-primary px-5 py-3 shrink-0 hover:bg-yellow-400 transition-colors"
						style={{
							clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%)",
						}}
					>
						{t("search.button")}
					</button>
				</form>
			</div>

			{/* Category filters */}
			{categories.length > 1 && (
				<div className="flex gap-2 flex-wrap justify-center mb-10">
					{categories.map((cat) => {
						const active = cat === (selectedCategory ?? "All");
						return (
							<button
								key={cat}
								type="button"
								onClick={() => {
									setSelectedCategory(cat === "All" ? null : cat);
									setPage(1);
								}}
								className="font-heading text-[7.5px] tracking-[2px] uppercase px-3 py-1.5 transition-colors duration-200"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									border: active ? "1px solid #ffd700" : "1px solid #222",
									background: active ? "rgba(255,215,0,0.10)" : "transparent",
									color: active ? "#ffd700" : "#555",
								}}
							>
								{cat}
							</button>
						);
					})}
				</div>
			)}

			{/* Section header */}
			<div className="flex items-end justify-between mb-8">
				<div>
					<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary block mb-2">
						{t("allPosts")}
					</span>
					<h2 className="font-heading font-black text-white leading-tight text-2xl">
						{t("latest")}{" "}
						<span
							style={{
								background: "linear-gradient(90deg, #ffd700, #ffc107)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							{t("articles")}
						</span>
					</h2>
				</div>
				<span
					className="font-heading text-[9px] tracking-[2px] uppercase"
					style={{ color: "#3a3a3a" }}
				>
					{categoryFiltered.length} post
					{categoryFiltered.length !== 1 ? "s" : ""}
				</span>
			</div>

			{/* Grid */}
			{pagePosts.length === 0 ? (
				<div className="min-h-[30vh] flex items-center justify-center py-12">
					<div className="bg-bg-dark border border-[#1e1e1e] rounded-sm p-12 flex flex-col items-center gap-4 text-center max-w-sm w-full">
						<FileText
							size={32}
							strokeWidth={1.5}
							stroke="rgba(255,215,0,0.3)"
							aria-hidden="true"
						/>
						<p className="font-heading text-[11px] tracking-[3px] text-primary uppercase">
							{t("noPostsFound")}
						</p>
						<p className="font-body text-[10px] text-text-gray">
							{t("noPostsTip")}
						</p>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{pagePosts.map((post) => (
						<BlogPostCard key={post.id} post={post} />
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 mt-10">
					{/* Prev */}
					<button
						type="button"
						onClick={() => setPage(Math.max(1, page - 1))}
						disabled={page === 1}
						className="w-[30px] h-[30px] flex items-center justify-center border border-[#1e1e1e] text-text-gray hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
					>
						<ChevronLeft size={14} strokeWidth={2.5} aria-hidden="true" />
					</button>

					{pages.map((p) => (
						<button
							key={p}
							type="button"
							onClick={() => setPage(p)}
							className="w-9 h-9 flex items-center justify-center text-sm font-heading transition-colors"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
								background: p === page ? "rgba(255,215,0,0.10)" : "transparent",
								border: `1px solid ${p === page ? "#ffd700" : "#222"}`,
								color: p === page ? "#ffd700" : "#555",
							}}
						>
							{p}
						</button>
					))}

					{/* Next */}
					<button
						type="button"
						onClick={() => setPage(Math.min(totalPages, page + 1))}
						disabled={page === totalPages}
						className="w-[30px] h-[30px] flex items-center justify-center border border-[#1e1e1e] text-text-gray hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
					>
						<ChevronRight size={14} strokeWidth={2.5} aria-hidden="true" />
					</button>
				</div>
			)}
		</div>
	);
}
