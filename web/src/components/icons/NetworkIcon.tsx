import { Network } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function NetworkIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Network
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
