interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function CarouselIcon({
	size = 24,
	strokeWidth = 2,
	className,
}: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<rect x="2" y="7" width="20" height="15" rx="2" />
			<path d="M16 3l4 4-4 4" />
			<path d="M8 3l-4 4 4 4" />
		</svg>
	);
}
