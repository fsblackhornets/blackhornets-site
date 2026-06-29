import { ChevronLeft } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ChevronLeftIcon({
	size,
	strokeWidth = 2,
	className,
}: IconProps) {
	return (
		<ChevronLeft
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
