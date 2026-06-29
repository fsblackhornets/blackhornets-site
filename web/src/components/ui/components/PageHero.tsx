import { RacingStripe } from "./RacingStripe";

interface PageHeroProps {
	watermark: string;
	title: string;
	highlight: string;
	subtitle: string;
	children?: React.ReactNode;
}

export function PageHero({
	watermark,
	title,
	highlight,
	subtitle,
	children,
}: PageHeroProps) {
	return (
		<section className="relative min-h-[260px] bg-[#080808] flex items-center justify-center overflow-hidden">
			<RacingStripe height={4} className="absolute top-0 inset-x-0 z-10" />

			{/* Grid overlay */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"linear-gradient(rgba(255,215,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.03) 1px, transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Watermark */}
			<div
				className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
				aria-hidden="true"
			>
				<span
					className="font-heading font-black text-primary"
					style={{
						fontSize: "clamp(100px, 20vw, 200px)",
						opacity: 0.03,
						letterSpacing: "-4px",
						lineHeight: 1,
					}}
				>
					{watermark}
				</span>
			</div>

			{/* Content */}
			<div className="relative z-10 text-center px-8 py-16 flex flex-col items-center">
				<p className="font-heading text-[9px] tracking-[10px] uppercase text-primary/70 mb-5">
					Black Hornets Racing
				</p>
				<h1 className="font-heading text-[clamp(2.2rem,6vw,3.5rem)] font-black uppercase tracking-[3px] leading-tight">
					<span className="block text-white">{title}</span>
					<span
						className="block"
						style={{
							background: "linear-gradient(90deg, #ffd700, #ffc107)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						{highlight}
					</span>
				</h1>

				{/* Speed lines */}
				<div className="flex justify-center gap-1 my-4">
					<div
						style={{
							width: "52px",
							height: "1px",
							background: "rgba(255,215,0,0.2)",
						}}
					/>
					<div
						style={{ width: "16px", height: "1px", background: "#ffd700" }}
					/>
					<div
						style={{
							width: "8px",
							height: "1px",
							background: "rgba(255,215,0,0.2)",
						}}
					/>
				</div>

				<p className="font-body text-[10px] tracking-[4px] uppercase text-[#555]">
					{subtitle}
				</p>

				{children}
			</div>

			<RacingStripe height={3} className="absolute bottom-0 inset-x-0" />
		</section>
	);
}
