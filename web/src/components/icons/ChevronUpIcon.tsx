import { ChevronUp } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ChevronUpIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<ChevronUp
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
