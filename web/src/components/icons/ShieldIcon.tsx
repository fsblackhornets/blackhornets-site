import { Shield } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ShieldIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Shield
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
