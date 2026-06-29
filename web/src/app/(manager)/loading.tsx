export default function ManagerLoading() {
	return (
		<div className="max-w-[1000px]">
			{/* Page header */}
			<div className="h-6 w-48 skeleton-shimmer rounded-sm mb-6" />

			{/* List rows */}
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					key={i}
					className="h-[52px] skeleton-shimmer rounded-sm mb-2 border-l-[2px] border-l-[#2a2a2a]"
				/>
			))}
		</div>
	);
}
