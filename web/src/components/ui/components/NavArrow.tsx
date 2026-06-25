import { cn } from "@/lib/utils";

interface NavArrowProps {
	direction: "left" | "right";
	onClick: () => void;
	disabled?: boolean;
	className?: string;
	label?: string;
}

export function NavArrow({
	direction,
	onClick,
	disabled = false,
	className,
	label,
}: NavArrowProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label ?? (direction === "left" ? "Previous" : "Next")}
			className={cn(
				"text-text-gray hover:text-primary transition-colors disabled:opacity-20 disabled:cursor-not-allowed p-3",
				className,
			)}
		>
			<i
				className={`fas fa-chevron-${direction} text-2xl`}
				aria-hidden="true"
			/>
		</button>
	);
}
