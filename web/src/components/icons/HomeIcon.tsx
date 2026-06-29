import { Home } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function HomeIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Home
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
