import Link from "next/link";
import { Suspense } from "react";
import { NewsList } from "./components/NewsList";
import { NewsListSkeleton } from "./components/NewsListSkeleton";

export function LatestNewsSection() {
	return (
		<section className="my-20 py-10 px-10 bg-bg-panel rounded-3xl max-w-[1050px] mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
			<div className="text-center mb-8">
				<h2 className="font-heading text-[clamp(2rem,6vw,3.5rem)] uppercase tracking-[3px] bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
					Latest News
				</h2>
				<div className="w-16 h-0.5 bg-primary mx-auto mt-3" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Suspense fallback={<NewsListSkeleton />}>
					<NewsList />
				</Suspense>
			</div>

			<div className="text-center mt-8">
				<Link
					href="/blog"
					className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary font-heading font-bold tracking-widest hover:bg-primary hover:text-bg-dark transition-colors duration-300"
				>
					More News
				</Link>
			</div>
		</section>
	);
}
