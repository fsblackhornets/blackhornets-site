import { CheckCircle } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function CheckCircleIcon({
	size,
	strokeWidth = 2,
	className,
}: IconProps) {
	return (
		<CheckCircle
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
