export function Field({
	label,
	htmlFor,
	error,
	children,
}: {
	label: string;
	htmlFor: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={htmlFor} className="text-text-gray text-sm font-semibold">
				{label}
			</label>
			{children}
			{error && <p className="text-red-400 text-xs">{error}</p>}
		</div>
	);
}
