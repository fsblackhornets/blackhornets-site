export function GalleryHero() {
	return (
		<section className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center">
			<div className="absolute inset-0 z-0">
				<video
					autoPlay
					muted
					loop
					playsInline
					className="w-full h-full object-cover"
				>
					<source src="/videos/dd_compressed.webm" type="video/webm" />
					<source src="/videos/dd_compressed.mp4" type="video/mp4" />
				</video>
				<div className="absolute inset-0 bg-black/60" />
			</div>
			<div className="relative z-10 text-center px-8">
				<h1 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[4px] text-primary drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">
					Our Gallery
				</h1>
				<p className="text-text-light text-xl tracking-widest mt-4">
					Capturing Our Racing Journey
				</p>
				<div className="w-24 h-0.5 bg-primary mx-auto mt-4" />
			</div>
		</section>
	);
}
