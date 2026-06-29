import { Pencil } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function PencilIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Pencil
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
