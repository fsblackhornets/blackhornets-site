import { Upload } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function UploadIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Upload
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
