export function SponsorsHero() {
	return (
		<section className="relative py-32 flex items-center justify-center bg-gradient-to-br from-black to-bg-panel overflow-hidden">
			<div
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(circle at center, rgba(255,215,0,0.05) 0%, transparent 70%)",
				}}
			/>
			<div className="relative z-10 text-center px-8">
				<h1 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[4px] text-primary drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">
					Our Sponsors
				</h1>
				<p className="text-text-light text-xl tracking-widest mt-4">
					Partners in Innovation and Excellence
				</p>
				<div className="w-24 h-0.5 bg-primary mx-auto mt-4" />
			</div>
		</section>
	);
}
