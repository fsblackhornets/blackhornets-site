import { Image } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ImageIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Image
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
