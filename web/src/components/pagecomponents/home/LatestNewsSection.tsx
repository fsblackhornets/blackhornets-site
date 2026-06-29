import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { NewsList } from "./components/NewsList";
import { NewsListSkeleton } from "./components/NewsListSkeleton";

export async function LatestNewsSection() {
	const t = await getTranslations("home.latestNews");

	return (
		<section
			className="my-20 max-w-screen-2xl mx-auto"
			style={{ borderTop: "3px solid #ffd700" }}
		>
			<div className="py-10">
				<div className="mb-10">
					<h2
						className="font-heading uppercase text-text-light"
						style={{
							fontSize: "clamp(2rem, 6vw, 3.5rem)",
							letterSpacing: "0.2em",
						}}
					>
						{t("heading")}
					</h2>
					<div
						style={{
							width: "64px",
							height: "2px",
							background: "#ffd700",
							marginTop: "12px",
						}}
					/>
				</div>

				<Suspense fallback={<NewsListSkeleton />}>
					<NewsList />
				</Suspense>

				<div className="text-center mt-10">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 px-8 py-3 font-heading font-bold tracking-widest text-primary hover:bg-primary hover:text-black transition-colors duration-300"
						style={{
							clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
							border: "2px solid #ffd700",
						}}
					>
						{t("moreNews")}
					</Link>
				</div>
			</div>
		</section>
	);
}
