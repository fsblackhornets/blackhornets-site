import { Link } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function LinkIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Link
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
