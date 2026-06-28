export function NewsListSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="animate-pulse" style={{ height: "320px", background: "#3a3a3a" }} />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="animate-pulse" style={{ height: "200px", background: "#3a3a3a" }} />
				<div className="animate-pulse" style={{ height: "200px", background: "#3a3a3a" }} />
			</div>
		</div>
	);
}
