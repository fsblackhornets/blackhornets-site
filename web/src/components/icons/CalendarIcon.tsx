import { Calendar } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function CalendarIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Calendar
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
