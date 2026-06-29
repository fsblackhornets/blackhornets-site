import { Newspaper } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function NewspaperIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Newspaper
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
