import { Eye } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function EyeIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Eye
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
