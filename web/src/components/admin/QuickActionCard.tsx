import Link from "next/link";

interface QuickActionCardProps {
	href: string;
	icon: string;
	label: string;
	desc: string;
}

export function QuickActionCard({
	href,
	icon,
	label,
	desc,
}: QuickActionCardProps) {
	return (
		<Link
			href={href}
			className="bg-[#111] border border-primary/12 rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(255,215,0,0.1)] transition-all duration-200"
		>
			<div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center text-primary text-lg">
				<i className={icon} aria-hidden="true" />
			</div>
			<span className="font-heading text-xs text-white tracking-wide uppercase">
				{label}
			</span>
			<span className="text-[11px] text-text-gray leading-tight">{desc}</span>
		</Link>
	);
}
