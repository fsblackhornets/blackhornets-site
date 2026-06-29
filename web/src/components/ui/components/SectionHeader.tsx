interface SectionHeaderProps {
	label: string;
	title: string;
	highlight?: string;
	align?: "left" | "center";
	className?: string;
}

export function SectionHeader({
	label,
	title,
	highlight,
	align = "left",
	className = "",
}: SectionHeaderProps) {
	return (
		<div className={`${align === "center" ? "text-center" : ""} ${className}`}>
			<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary mb-3 block">
				{label}
			</span>
			<h2 className="font-heading text-[clamp(1.4rem,3vw,1.8rem)] font-black uppercase tracking-[2px] text-white leading-tight">
				{title}
				{highlight && (
					<>
						{" "}
						<span
							style={{
								background: "linear-gradient(90deg, #ffd700, #ffc107)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							{highlight}
						</span>
					</>
				)}
			</h2>
		</div>
	);
}
