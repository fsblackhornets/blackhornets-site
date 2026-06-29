import { Users } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function UsersIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Users
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
