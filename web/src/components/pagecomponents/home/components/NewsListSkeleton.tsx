export function NewsListSkeleton() {
	return (
		<>
			{[0, 1].map((i) => (
				<div key={i} className="h-72 bg-gray-mid rounded-xl animate-pulse" />
			))}
		</>
	);
}
