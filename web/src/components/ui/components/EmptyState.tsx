interface EmptyStateProps {
	icon?: string;
	title: string;
	description?: string;
	action?: React.ReactNode;
}

export function EmptyState({
	icon = "⚡",
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center gap-4">
			<span className="text-5xl">{icon}</span>
			<h3 className="text-xl font-heading text-primary">{title}</h3>
			{description && <p className="text-text-gray max-w-sm">{description}</p>}
			{action}
		</div>
	);
}

export function ErrorState({ title = "Failed to load" }: { title?: string }) {
	return (
		<EmptyState icon="⚠️" title={title} description="Please try again later." />
	);
}
