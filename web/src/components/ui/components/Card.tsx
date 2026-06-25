import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	hover?: boolean;
}

export function Card({
	hover = false,
	className,
	children,
	...props
}: CardProps) {
	return (
		<div
			className={cn(
				"bg-bg-panel rounded-2xl border border-gray-mid p-6",
				hover &&
					"transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(255,215,0,0.08)]",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
