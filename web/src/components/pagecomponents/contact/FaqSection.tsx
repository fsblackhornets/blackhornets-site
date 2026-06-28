import { FAQS } from "./constants";

export function FaqSection() {
	return (
		<section
			className="py-20 px-4 max-w-screen-2xl mx-auto"
			style={{ borderTop: "3px solid #ffd700" }}
		>
			{/* Header */}
			<div className="mb-10">
				<span className="font-heading text-primary text-xs tracking-[5px] uppercase block mb-3">
					FAQ
				</span>
				<h2
					className="font-heading font-black text-white leading-tight"
					style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}
				>
					Frequently Asked{" "}
					<span
						style={{
							background: "linear-gradient(90deg, #ffd700, #ffc107)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
						}}
					>
						Questions
					</span>
				</h2>
			</div>

			{/* FAQ items */}
			<div>
				{FAQS.map(({ q, a }) => (
					<details key={q} className="group border-t border-gray-dark py-4">
						<summary className="flex items-center justify-between font-heading text-[10px] tracking-[1px] uppercase cursor-pointer list-none text-text-gray group-open:text-primary transition-colors">
							{q}
							{/* Chevron */}
							<div
								className="w-7 h-7 rounded-full border border-gray-dark bg-bg-dark flex items-center justify-center shrink-0 ml-4 transition-colors group-open:border-primary/25 group-open:bg-primary/8"
							>
								<svg
									className="w-3.5 h-3.5 text-text-gray group-open:text-primary transition-transform group-open:rotate-180"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2.5}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<polyline points="6 9 12 15 18 9" />
								</svg>
							</div>
						</summary>
						<p className="font-body text-[10px] leading-[1.8] text-text-gray pb-4 max-w-3xl mt-3">
							{a}
						</p>
					</details>
				))}
				<div className="border-t border-gray-dark" />
			</div>
		</section>
	);
}
