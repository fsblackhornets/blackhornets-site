import { Clock } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ClockIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Clock
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
