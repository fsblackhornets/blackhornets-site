import { getLocale } from "next-intl/server";
import { fetchLatestPosts } from "@/lib/api/posts";
import { NewsCard } from "../NewsCard";

export async function NewsList() {
	const [posts, locale] = await Promise.all([fetchLatestPosts(), getLocale()]);

	if (posts.length === 0) {
		return <p className="text-center text-text-gray">No news found.</p>;
	}

	const [featured, ...rest] = posts;

	return (
		<div className="flex flex-col gap-6">
			<NewsCard post={featured} variant="featured" locale={locale} />
			{rest.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{rest.map((post) => (
						<NewsCard
							key={post.id}
							post={post}
							variant="small"
							locale={locale}
						/>
					))}
				</div>
			)}
		</div>
	);
}
