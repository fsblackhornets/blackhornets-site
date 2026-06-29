import { Inbox } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function InboxIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Inbox
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
