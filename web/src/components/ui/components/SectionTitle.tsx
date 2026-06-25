export function SectionTitle({ icon, title }: { icon: string; title: string }) {
	return (
		<div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-mid">
			<i className={`${icon} text-primary`} aria-hidden="true" />
			<h3 className="font-heading text-sm tracking-widest text-primary uppercase">
				{title}
			</h3>
		</div>
	);
}
