export default function BlogLoading() {
	return (
		<div className="max-w-screen-2xl mx-auto px-4 py-8">
			{/* Hero */}
			<div className="h-[220px] skeleton-shimmer rounded-sm w-full" />

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					<div key={i}>
						<div className="h-[160px] skeleton-shimmer rounded-sm mb-3" />
						<div className="h-3 w-[60%] skeleton-shimmer rounded-sm mb-2" />
						<div className="h-5 skeleton-shimmer rounded-sm mb-2" />
						<div className="h-3 skeleton-shimmer rounded-sm mb-1" />
						<div className="h-3 skeleton-shimmer rounded-sm mb-1" />
						<div className="h-3 skeleton-shimmer rounded-sm mb-1" />
						<div className="h-px bg-[#1e1e1e] mt-4 mb-3" />
						<div className="flex justify-between">
							<div className="h-3 w-16 skeleton-shimmer rounded-sm" />
							<div className="h-3 w-16 skeleton-shimmer rounded-sm" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
