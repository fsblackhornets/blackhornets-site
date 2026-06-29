import { Check } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function CheckIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Check
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
