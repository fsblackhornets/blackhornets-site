import { Save } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function SaveIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Save
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
