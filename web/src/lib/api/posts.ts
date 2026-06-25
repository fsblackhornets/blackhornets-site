import { apiGet } from "@/lib/api-client";
import type { Post } from "@/types/post";

export async function fetchLatestPosts(): Promise<Post[]> {
	try {
		const posts = await apiGet<Post[]>("posts", { next: { revalidate: 60 } });
		return posts.slice(0, 2);
	} catch {
		return [];
	}
}

export async function fetchAllPosts(): Promise<Post[]> {
	try {
		return await apiGet<Post[]>("posts", { next: { revalidate: 60 } });
	} catch {
		return [];
	}
}
