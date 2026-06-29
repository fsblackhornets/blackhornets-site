import { Trash2 } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function TrashIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Trash2
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
