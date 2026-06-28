import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact/ContactForm";
import { SOCIAL_LINKS } from "@/components/layout/constants";
import { FaqSection } from "@/components/pagecomponents/contact/FaqSection";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";

export const metadata: Metadata = {
	title: `Contact — ${SITE_NAME}`,
	description:
		"Get in touch with Black Hornets Racing. Contact us for sponsorship opportunities, questions, or to arrange a workshop visit.",
	openGraph: {
		title: `Contact — ${SITE_NAME}`,
		description: "Get in touch with Black Hornets Racing.",
		type: "website",
		siteName: SITE_NAME,
		images: [{ url: SITE_OG_IMAGE }],
	},
};

export default function ContactPage() {
	return (
		<>
			{/* Hero */}
			<section
				className="relative py-28 flex flex-col items-center justify-center overflow-hidden"
				style={{ background: "#080808" }}
			>
				{/* Racing stripe */}
				<div className="absolute top-0 left-0 right-0 z-20 flex h-[4px]">
					<div className="flex-1 bg-primary" />
					<div className="w-[80px] bg-bg-dark" />
					<div className="w-[30px] bg-primary" />
				</div>

				{/* CONTACT watermark */}
				<div
					className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
					aria-hidden="true"
				>
					<span
						className="font-heading font-black text-white"
						style={{
							fontSize: "clamp(5rem, 22vw, 16rem)",
							opacity: 0.03,
							letterSpacing: "0.12em",
							lineHeight: 1,
						}}
					>
						CONTACT
					</span>
				</div>

				{/* Content */}
				<div className="relative z-10 text-center px-8 flex flex-col items-center">
					<h1
						className="font-heading font-black leading-[1.05]"
						style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
					>
						<span className="block text-white">Get In</span>
						<span
							className="block"
							style={{
								background: "linear-gradient(90deg, #ffd700, #ffc107)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							Touch
						</span>
					</h1>

					{/* Speed lines */}
					<div className="flex flex-col items-center gap-1.5 my-5">
						<div style={{ width: "52px", height: "2px", background: "#ffd700", opacity: 0.9 }} />
						<div style={{ width: "16px", height: "1.5px", background: "#ffd700", opacity: 0.5 }} />
						<div style={{ width: "8px", height: "1px", background: "#ffd700", opacity: 0.2 }} />
					</div>

					<p
						className="font-body font-light text-text-light"
						style={{ fontSize: "0.7rem", letterSpacing: "4px", textTransform: "uppercase" }}
					>
						We&apos;d love to hear from you
					</p>
				</div>

				{/* Gold bottom border */}
				<div
					className="absolute bottom-0 left-0 right-0 z-20"
					style={{ height: "3px", background: "#ffd700" }}
				/>
			</section>

			{/* Form + Contact info */}
			<section className="py-16 px-4 max-w-screen-2xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Form column */}
					<div>
						<h2 className="font-heading text-sm text-primary tracking-widest uppercase mb-6">
							Send a Message
						</h2>
						<ContactForm />
					</div>

					{/* Contact info column */}
					<div className="flex flex-col gap-6">
						<h2 className="font-heading text-sm text-primary tracking-widest uppercase">
							Get in Touch
						</h2>

						<div className="flex flex-col gap-3">
							{/* Location */}
							<a
								href="https://maps.google.com/?q=Faculty+of+Technical+Sciences+Novi+Sad"
								target="_blank"
								rel="noopener noreferrer"
								className="flex gap-4 items-start p-5 bg-bg-dark border border-gray-dark border-l-2 border-l-primary rounded-sm hover:border-l-yellow-400 transition-colors"
							>
								<div className="w-9 h-9 rounded-full border border-primary/25 flex items-center justify-center bg-primary/5 shrink-0">
									<i className="fas fa-map-marker-alt text-primary text-sm" aria-hidden="true" />
								</div>
								<div>
									<p className="font-heading text-[9px] tracking-[2px] uppercase text-text-light mb-1">
										Location
									</p>
									<p className="font-body text-text-gray text-sm">University of Novi Sad, Serbia</p>
									<p className="font-body text-text-gray text-xs mt-0.5">Faculty of Technical Sciences</p>
								</div>
							</a>

							{/* Email */}
							<a
								href="mailto:formulastudentftn@gmail.com"
								className="flex gap-4 items-start p-5 bg-bg-dark border border-gray-dark border-l-2 border-l-primary rounded-sm hover:border-l-yellow-400 transition-colors"
							>
								<div className="w-9 h-9 rounded-full border border-primary/25 flex items-center justify-center bg-primary/5 shrink-0">
									<i className="fas fa-envelope text-primary text-sm" aria-hidden="true" />
								</div>
								<div>
									<p className="font-heading text-[9px] tracking-[2px] uppercase text-text-light mb-1">
										Email
									</p>
									<p className="font-body text-text-gray text-sm">formulastudentftn@gmail.com</p>
								</div>
							</a>

							{/* Phone */}
							<a
								href="tel:+38162782568"
								className="flex gap-4 items-start p-5 bg-bg-dark border border-gray-dark border-l-2 border-l-primary rounded-sm hover:border-l-yellow-400 transition-colors"
							>
								<div className="w-9 h-9 rounded-full border border-primary/25 flex items-center justify-center bg-primary/5 shrink-0">
									<i className="fas fa-phone text-primary text-sm" aria-hidden="true" />
								</div>
								<div>
									<p className="font-heading text-[9px] tracking-[2px] uppercase text-text-light mb-1">
										Phone
									</p>
									<p className="font-body text-text-gray text-sm">+381 62 782 568</p>
								</div>
							</a>
						</div>

						{/* Follow Us */}
						<div>
							<p className="font-heading text-[9px] tracking-[2px] uppercase text-text-gray mb-3">
								Follow Us
							</p>
							<div className="flex gap-2.5">
								{SOCIAL_LINKS.map(({ href, Icon, label }) => (
									<a
										key={href}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors duration-300"
									>
										<Icon className="w-4 h-4" />
										<span className="sr-only">{label}</span>
									</a>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<FaqSection />
		</>
	);
}
