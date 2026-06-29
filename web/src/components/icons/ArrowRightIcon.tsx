import { ArrowRight } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ArrowRightIcon({
	size,
	strokeWidth = 2,
	className,
}: IconProps) {
	return (
		<ArrowRight
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
