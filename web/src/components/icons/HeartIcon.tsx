import { Heart } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function HeartIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Heart
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
