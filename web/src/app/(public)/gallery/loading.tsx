export default function GalleryLoading() {
	const heights = [
		"h-[120px]",
		"h-[180px]",
		"h-[120px]",
		"h-[180px]",
		"h-[180px]",
		"h-[120px]",
		"h-[120px]",
		"h-[180px]",
		"h-[180px]",
		"h-[120px]",
		"h-[180px]",
		"h-[120px]",
	];

	return (
		<div className="max-w-screen-2xl mx-auto px-4 py-8">
			{/* Hero */}
			<div className="h-[220px] skeleton-shimmer rounded-sm mb-8" />

			{/* Category tabs */}
			<div className="flex gap-2 mb-6 flex-wrap">
				{Array.from({ length: 4 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					<div key={i} className="h-7 w-20 skeleton-shimmer rounded-sm" />
				))}
			</div>

			{/* Masonry grid */}
			<div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
				{heights.map((h, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					<div key={i} className={`${h} skeleton-shimmer rounded-sm mb-3`} />
				))}
			</div>
		</div>
	);
}
