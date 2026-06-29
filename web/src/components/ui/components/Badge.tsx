import { type BadgeVariant, STATUS_VARIANT_MAP } from "@/constants/ui";
import { ParaBadge, type ParaBadgeVariant } from "./ParaBadge";

const VARIANT_MAP: Record<BadgeVariant, ParaBadgeVariant> = {
	default: "gray",
	success: "green",
	warning: "orange",
	danger: "gray",
	info: "blue",
	gold: "gold",
};

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
		<ParaBadge variant={VARIANT_MAP[variant]} className={className}>
			{children}
		</ParaBadge>
	);
}

export function StatusBadge({ status }: { status: string }) {
	return (
		<Badge variant={STATUS_VARIANT_MAP[status.toLowerCase()] ?? "default"}>
			{status}
		</Badge>
	);
}
