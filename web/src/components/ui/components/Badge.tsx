import { cn } from "@/lib/utils";
import {
	BADGE_VARIANT_CLASSES,
	type BadgeVariant,
	STATUS_VARIANT_MAP,
} from "../constants";

interface BadgeProps {
	children: React.ReactNode;
	variant?: BadgeVariant;
	className?: string;
}

export function Badge({
	children,
	variant = "default",
	className,
}: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide",
				BADGE_VARIANT_CLASSES[variant],
				className,
			)}
		>
			{children}
		</span>
	);
}

export function StatusBadge({ status }: { status: string }) {
	return (
		<Badge variant={STATUS_VARIANT_MAP[status.toLowerCase()] ?? "default"}>
			{status}
		</Badge>
	);
}
