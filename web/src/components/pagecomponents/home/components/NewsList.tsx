import { fetchLatestPosts } from "@/lib/api/posts";
import { NewsCard } from "../NewsCard";

export async function NewsList() {
	const posts = await fetchLatestPosts();

	if (posts.length === 0) {
		return (
			<p className="text-center text-text-gray col-span-2">No news found.</p>
		);
	}

	return (
		<>
			{posts.map((post) => (
				<NewsCard key={post.id} post={post} />
			))}
		</>
	);
}
