import { FileText } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function FileTextIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<FileText
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
