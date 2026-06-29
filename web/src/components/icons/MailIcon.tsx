import { Mail } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function MailIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Mail
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
