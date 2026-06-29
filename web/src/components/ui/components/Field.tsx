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
			<label
				htmlFor={htmlFor}
				className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-1.5 block"
			>
				{label}
			</label>
			{children}
			{error && <p className="text-red-400 text-[8px] mt-1">{error}</p>}
		</div>
	);
}
