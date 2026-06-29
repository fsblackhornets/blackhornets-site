import { ExternalLink } from "lucide-react";

interface IconProps {
	size?: number;
	className?: string;
	strokeWidth?: number;
}

export function ExternalLinkIcon({
	size,
	strokeWidth = 2,
	className,
}: IconProps) {
	return (
		<ExternalLink
			size={size}
			strokeWidth={strokeWidth}
			className={className}
			aria-hidden="true"
		/>
	);
}
