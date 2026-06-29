import { Clipboard } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ClipboardIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Clipboard
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
