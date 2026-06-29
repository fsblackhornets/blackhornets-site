import { ArrowLeft } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ArrowLeftIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<ArrowLeft
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
