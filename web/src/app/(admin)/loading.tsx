export default function AdminLoading() {
	return (
		<div className="max-w-[1000px]">
			{/* Page header */}
			<div className="h-6 w-48 skeleton-shimmer rounded-sm mb-6" />

			{/* Stats grid */}
			<div className="grid grid-cols-4 gap-4 mb-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
						key={i}
						className="h-[90px] skeleton-shimmer rounded-sm border-t-2 border-t-[#2a2a2a]"
					/>
				))}
			</div>

			{/* List rows */}
			{Array.from({ length: 5 }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					key={i}
					className="h-[52px] skeleton-shimmer rounded-sm mb-2 border-l-[2px] border-l-[#2a2a2a]"
				/>
			))}
		</div>
	);
}
