import { HeroBadges } from "./components/HeroBadges";

export function AboutHero() {
	return (
		<section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center">
			{/* Video background */}
			<div className="absolute inset-0 z-0">
				<video
					autoPlay
					muted
					loop
					playsInline
					className="w-full h-full object-cover"
				>
					<source src="/videos/formula-red.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-black/60" />
			</div>

			{/* Content */}
			<div className="relative z-10 text-center px-8">
				<h1 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[4px] text-primary drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
					About Black Hornets
				</h1>
				<p className="text-text-light text-xl tracking-widest mt-4">
					Driving innovation in student racing.
				</p>
				<div className="w-24 h-0.5 bg-primary mx-auto mt-4" />

				<HeroBadges />
			</div>
		</section>
	);
}
