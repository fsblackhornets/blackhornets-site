import { Quote } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function QuoteIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Quote
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
