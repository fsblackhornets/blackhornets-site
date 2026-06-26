export function TeamHero() {
	return (
		<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-bg-panel overflow-hidden">
			{/* Background */}
			<div
				className="absolute inset-0 z-[1]"
				style={{
					background:
						"radial-gradient(circle at center, rgba(255,215,0,0.06) 0%, transparent 70%)",
				}}
			/>
			<div className="hero-grid-overlay absolute inset-0 z-[1]" />

			{/* Content */}
			<div className="relative z-10 text-center px-8">
				<p className="font-heading text-xs tracking-[6px] text-primary/60 uppercase mb-6">
					Formula Student Novi Sad
				</p>
				<h1 className="font-heading text-[clamp(3rem,9vw,6rem)] font-black tracking-[6px] text-primary drop-shadow-[0_0_40px_rgba(255,215,0,0.35)]">
					Our Team
				</h1>
				<div className="w-24 h-0.5 bg-primary mx-auto mt-6 mb-6" />
				<p className="text-text-light text-lg tracking-widest max-w-xl mx-auto">
					Meet the innovators behind Black Hornets Racing.
				</p>
			</div>

			{/* Scroll indicator */}
			<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-text-gray font-heading z-10">
				<div className="w-[30px] h-[50px] border-2 border-text-gray rounded-[25px] mx-auto mb-2 flex justify-center pt-2">
					<div className="w-1.5 h-1.5 bg-primary rounded-full animate-scroll-mouse" />
				</div>
				<span className="text-xs tracking-widest">Scroll Down</span>
			</div>
		</section>
	);
}
