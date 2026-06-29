import { Plus } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function PlusIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Plus
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
