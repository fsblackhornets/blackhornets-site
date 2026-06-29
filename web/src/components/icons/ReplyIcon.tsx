import { CornerUpLeft } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ReplyIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<CornerUpLeft
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
