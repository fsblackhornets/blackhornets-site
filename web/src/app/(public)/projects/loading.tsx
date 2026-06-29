export default function ProjectsLoading() {
	return (
		<div className="max-w-screen-2xl mx-auto px-4 py-8">
			{/* Hero */}
			<div className="h-[220px] skeleton-shimmer rounded-sm mb-10" />

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					<div key={i}>
						<div className="h-[120px] skeleton-shimmer rounded-sm mb-3" />
						<div className="h-4 w-[55%] skeleton-shimmer rounded-sm mb-2" />
						<div className="h-3 skeleton-shimmer rounded-sm mb-1" />
						<div className="h-3 skeleton-shimmer rounded-sm mb-1" />
						<div className="h-1 skeleton-shimmer rounded-sm mt-3" />
					</div>
				))}
			</div>
		</div>
	);
}
