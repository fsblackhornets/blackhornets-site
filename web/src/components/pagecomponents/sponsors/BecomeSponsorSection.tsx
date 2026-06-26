export function BecomeSponsorSection() {
	return (
		<section className="py-20 px-4 bg-bg-panel">
			<div className="max-w-screen-2xl mx-auto text-center flex flex-col items-center gap-8">
				<div>
					<h2 className="font-heading text-[clamp(2rem,5vw,3rem)] uppercase tracking-[3px] bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent mb-4">
						Become a Sponsor
					</h2>
					<p className="text-text-gray leading-relaxed max-w-2xl mx-auto">
						If you want to share our vision and invest in the potential of young
						ambitious people, in our partner brochure you can find out how to
						become a sponsor.
					</p>
				</div>

				<div className="flex gap-4 flex-wrap justify-center">
					<a
						href="/files/brochure.pdf"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-bg-dark font-heading font-bold tracking-widest border-2 border-primary hover:bg-transparent hover:text-primary transition-colors duration-300"
					>
						<i className="fas fa-download" aria-hidden="true" />
						Partner Brochure
					</a>
					<a
						href="mailto:formulastudentftn@gmail.com"
						className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-primary text-primary font-heading font-bold tracking-widest hover:bg-primary hover:text-bg-dark transition-colors duration-300"
					>
						<i className="fas fa-envelope" aria-hidden="true" />
						Contact Us
					</a>
				</div>
			</div>
		</section>
	);
}
