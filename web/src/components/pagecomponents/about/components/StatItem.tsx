import type { ComponentType } from "react";

export function StatItem({
	Icon,
	value,
	label,
}: {
	Icon: ComponentType<{ className?: string }>;
	value: React.ReactNode;
	label: string;
}) {
	return (
		<div className="flex flex-col items-center gap-2 text-center">
			<Icon className="w-8 h-8 text-primary" />
			<h3 className="font-heading text-4xl text-primary">{value}</h3>
			<p className="text-text-gray text-sm tracking-widest uppercase">
				{label}
			</p>
		</div>
	);
}
