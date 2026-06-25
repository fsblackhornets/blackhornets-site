export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeVariant =
	| "default"
	| "success"
	| "warning"
	| "danger"
	| "info"
	| "gold";
export type SpinnerSize = "sm" | "md" | "lg";

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary:
		"bg-primary text-bg-dark font-semibold hover:bg-yellow-300 disabled:opacity-60",
	secondary:
		"border-2 border-primary text-primary hover:bg-primary hover:text-bg-dark disabled:opacity-60",
	ghost: "text-primary hover:bg-primary/10 disabled:opacity-60",
	danger:
		"bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60",
};

export const BUTTON_SIZE_CLASSES: Record<ButtonSize, string> = {
	sm: "px-3 py-1.5 text-sm gap-1.5",
	md: "px-5 py-2.5 text-sm gap-2",
	lg: "px-7 py-3 text-base gap-2.5",
};

export const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
	default: "bg-gray-mid text-text-light",
	gold: "bg-primary/15 text-primary",
	success: "bg-green-500/20 text-green-400",
	warning: "bg-yellow-500/20 text-yellow-300",
	danger: "bg-red-500/20 text-red-400",
	info: "bg-blue-500/20 text-blue-400",
};

export const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
	active: "success",
	published: "success",
	accepted: "success",
	approved: "success",
	pending: "warning",
	reviewing: "warning",
	draft: "info",
	rejected: "danger",
	declined: "danger",
	inactive: "danger",
	completed: "gold",
};

export const SPINNER_SIZE_CLASSES: Record<SpinnerSize, string> = {
	sm: "w-4 h-4",
	md: "w-8 h-8",
	lg: "w-12 h-12",
};
