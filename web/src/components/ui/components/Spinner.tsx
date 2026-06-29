import { SPINNER_SIZE_CLASSES, type SpinnerSize } from "@/constants/ui";
import { SpinnerIcon } from "../../icons/SpinnerIcon";

interface SpinnerProps {
	size?: SpinnerSize;
	className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
	return (
		<SpinnerIcon
			className={`animate-spin text-primary ${SPINNER_SIZE_CLASSES[size]} ${className}`}
			aria-label="Loading"
			role="status"
		/>
	);
}
