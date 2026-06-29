import Link from "next/link";

interface StatCardProps {
	href: string;
	icon: string;
	label: string;
	value: number | string;
	children?: React.ReactNode;
}

export function StatCard({
	href,
	icon,
	label,
	value,
	children,
}: StatCardProps) {
	return (
		<Link
			href={href}
			className="bg-[#111] border border-primary/10 rounded-xl p-5 flex flex-col gap-2 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
		>
			<div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1">
				<i className={icon} aria-hidden="true" />
			</div>
			<span className="text-[11px] tracking-widest uppercase text-text-gray">
				{label}
			</span>
			<span className="font-heading text-3xl text-primary leading-none">
				{value}
			</span>
			{children && <div className="text-xs text-text-gray/60">{children}</div>}
		</Link>
	);
}
