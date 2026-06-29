import { Star } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function StarIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Star
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
