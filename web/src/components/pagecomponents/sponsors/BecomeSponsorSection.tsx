import { Download, Mail } from "lucide-react";

export function BecomeSponsorSection() {
	return (
		<section className="py-20 px-4 bg-[#0b0b0b] border-t-[3px] border-primary">
			<div className="max-w-screen-2xl mx-auto flex flex-col items-center gap-8">
				{/* Section header */}
				<div className="text-center">
					<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary block mb-2">
						Partnership
					</span>
					<h2 className="font-heading font-black text-white text-2xl leading-tight">
						Become a{" "}
						<span
							style={{
								background: "linear-gradient(90deg, #ffd700, #ffc107)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							Sponsor
						</span>
					</h2>
				</div>

				<p className="font-body text-[10px] leading-[1.9] text-[#666] max-w-2xl mx-auto text-center">
					If you want to share our vision and invest in the potential of young
					ambitious people, in our partner brochure you can find out how to
					become a sponsor.
				</p>

				<div className="flex gap-4 flex-wrap justify-center">
					<a
						href="/files/brochure.pdf"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							clipPath: "polygon(0 0, calc(100% - 9px) 0, 100% 100%, 9px 100%)",
						}}
						className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-bg-dark font-heading text-[9px] tracking-[3px] uppercase hover:bg-yellow-300 transition-colors"
					>
						<Download size={12} strokeWidth={2} aria-hidden="true" />
						Partner Brochure
					</a>
					<a
						href="mailto:formulastudentftn@gmail.com"
						style={{
							clipPath: "polygon(0 0, calc(100% - 9px) 0, 100% 100%, 9px 100%)",
						}}
						className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary text-primary font-heading text-[9px] tracking-[3px] uppercase hover:bg-primary hover:text-bg-dark transition-colors"
					>
						<Mail size={12} strokeWidth={2} aria-hidden="true" />
						Contact Us
					</a>
				</div>
			</div>
		</section>
	);
}
