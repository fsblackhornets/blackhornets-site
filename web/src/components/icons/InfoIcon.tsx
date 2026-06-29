import { Info } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function InfoIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Info
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
