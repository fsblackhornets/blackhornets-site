import { apiGet } from "@/lib/api-client";
import type { Post } from "@/types/post";

interface PostsResponse {
	status: string;
	data: Post[];
}

interface PostResponse {
	status: string;
	data: Post;
}

export async function fetchAllPosts(): Promise<Post[]> {
	try {
		const res = await apiGet<PostsResponse>("posts", {
			next: { revalidate: 60 },
		});
		return res.data ?? [];
	} catch {
		return [];
	}
}

export async function fetchLatestPosts(): Promise<Post[]> {
	const posts = await fetchAllPosts();
	return posts.slice(0, 2);
}

export async function fetchPost(id: number): Promise<Post | null> {
	try {
		const res = await apiGet<PostResponse>(`posts/${id}`, {
			next: { revalidate: 60 },
		});
		return res.data ?? null;
	} catch {
		return null;
	}
}
