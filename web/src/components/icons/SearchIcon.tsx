import { Search } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function SearchIcon({ size, strokeWidth = 2, className }: IconProps) {
	return (
		<Search
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
