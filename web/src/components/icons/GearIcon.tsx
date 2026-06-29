import { Settings } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function GearIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Settings
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
