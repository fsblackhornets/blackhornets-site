import { AlertCircle } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function AlertCircleIcon({
	size,
	strokeWidth = 2,
	className,
}: IconProps) {
	return (
		<AlertCircle
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
