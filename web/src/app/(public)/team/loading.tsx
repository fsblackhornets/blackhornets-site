export default function TeamLoading() {
	return (
		<div className="max-w-screen-2xl mx-auto px-4 py-8">
			{/* Hero */}
			<div className="h-[220px] skeleton-shimmer rounded-sm mb-10" />

			{/* Department tabs */}
			<div className="flex gap-2 flex-wrap">
				{Array.from({ length: 5 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					<div key={i} className="h-8 w-24 skeleton-shimmer rounded-sm" />
				))}
			</div>

			{/* Members grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
				{Array.from({ length: 8 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					<div key={i} className="text-center">
						<div className="w-16 h-16 rounded-full skeleton-shimmer mx-auto mb-3" />
						<div className="h-4 w-[70%] skeleton-shimmer rounded-sm mx-auto mb-1" />
						<div className="h-3 w-[50%] skeleton-shimmer rounded-sm mx-auto" />
					</div>
				))}
			</div>
		</div>
	);
}
