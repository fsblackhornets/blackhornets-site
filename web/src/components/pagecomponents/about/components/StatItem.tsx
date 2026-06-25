export function StatItem({
	icon,
	value,
	label,
}: {
	icon: string;
	value: React.ReactNode;
	label: string;
}) {
	return (
		<div className="flex flex-col items-center gap-2 text-center">
			<i className={`${icon} text-3xl text-primary`} aria-hidden="true" />
			<h3 className="font-heading text-4xl text-primary">{value}</h3>
			<p className="text-text-gray text-sm tracking-widest uppercase">
				{label}
			</p>
		</div>
	);
}
