interface RacingStripeProps {
	height?: number;
	className?: string;
}

export function RacingStripe({
	height = 3,
	className = "",
}: RacingStripeProps) {
	return (
		<div className={`flex ${className}`} style={{ height: `${height}px` }}>
			<div className="flex-1 bg-primary" />
			<div className="w-16 bg-transparent" />
			<div className="w-7 bg-primary" />
		</div>
	);
}
