import Link from "next/link";

type ParaButtonVariant = "solid" | "outline";
type ParaButtonSize = "sm" | "md" | "lg";

const CLIP: Record<ParaButtonSize, string> = {
	sm: "polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
	md: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
	lg: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)",
};

const PADDING: Record<ParaButtonSize, string> = {
	sm: "py-2 px-4",
	md: "py-3 px-6",
	lg: "py-4 px-8",
};

const FONT_SIZE: Record<ParaButtonSize, string> = {
	sm: "text-[7px]",
	md: "text-[8px]",
	lg: "text-[10px]",
};

interface ParaButtonProps {
	children: React.ReactNode;
	variant?: ParaButtonVariant;
	size?: ParaButtonSize;
	href?: string;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	className?: string;
	icon?: React.ReactNode;
}

export function ParaButton({
	children,
	variant = "solid",
	size = "md",
	href,
	onClick,
	type = "button",
	disabled = false,
	className = "",
	icon,
}: ParaButtonProps) {
	const variantCls =
		variant === "outline"
			? "border border-primary text-primary bg-transparent hover:bg-primary hover:text-black"
			: "bg-primary text-black hover:bg-yellow-300";

	const baseCls = [
		"inline-flex items-center justify-center gap-2 font-heading tracking-[2px] uppercase transition-colors",
		PADDING[size],
		FONT_SIZE[size],
		variantCls,
		disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const clipPath = CLIP[size];

	if (href && !disabled) {
		return (
			<Link href={href} className={baseCls} style={{ clipPath }}>
				{icon}
				{children}
			</Link>
		);
	}

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={baseCls}
			style={{ clipPath }}
		>
			{icon}
			{children}
		</button>
	);
}
