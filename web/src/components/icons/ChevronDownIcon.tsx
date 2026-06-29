import { ChevronDown } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ChevronDownIcon({
	size,
	strokeWidth = 2,
	className,
}: IconProps) {
	return (
		<ChevronDown
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
