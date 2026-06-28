export type ParaBadgeVariant =
	| "gold"
	| "gold-outline"
	| "green"
	| "blue"
	| "orange"
	| "purple"
	| "gray";

const VARIANT_CLS: Record<ParaBadgeVariant, string> = {
	gold: "bg-primary text-black",
	"gold-outline": "bg-primary/10 text-primary border border-primary/25",
	green: "bg-green-500/10 text-green-400 border border-green-500/20",
	blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
	orange: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
	purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
	gray: "bg-[#1e1e1e] text-[#666] border border-[#2a2a2a]",
};

interface ParaBadgeProps {
	children: React.ReactNode;
	variant?: ParaBadgeVariant;
	className?: string;
}

export function ParaBadge({
	children,
	variant = "gold-outline",
	className = "",
}: ParaBadgeProps) {
	return (
		<span
			className={`inline-block font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1.5 ${VARIANT_CLS[variant]} ${className}`}
			style={{
				clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
			}}
		>
			{children}
		</span>
	);
}
