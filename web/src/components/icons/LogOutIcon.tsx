import { LogOut } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function LogOutIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<LogOut
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
