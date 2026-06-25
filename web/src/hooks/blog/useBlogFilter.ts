import { useMemo, useState } from "react";
import { resolvePostTitle } from "@/lib/utils/utils";
import type { Post } from "@/types/post";

const PER_PAGE = 9;

export function useBlogFilter(posts: Post[]) {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		if (!search.trim()) return posts;
		const q = search.toLowerCase();
		return posts.filter((p) => resolvePostTitle(p).toLowerCase().includes(q));
	}, [posts, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
	const pagePosts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	const handleSearch = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	return { pagePosts, search, page, totalPages, handleSearch, setPage };
}
