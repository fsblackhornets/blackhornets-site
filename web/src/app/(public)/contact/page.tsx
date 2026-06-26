import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact/ContactForm";
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
			<section className="relative py-28 flex items-center justify-center bg-gradient-to-br from-black to-bg-panel overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at center, rgba(255,215,0,0.05) 0%, transparent 70%)",
					}}
				/>
				<div className="relative z-10 text-center px-8">
					<h1 className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-[4px] text-primary drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">
						Contact Us
					</h1>
					<p className="text-text-light text-xl tracking-widest mt-4">
						We&apos;d love to hear from you
					</p>
					<div className="w-24 h-0.5 bg-primary mx-auto mt-4" />
				</div>
			</section>

			<section className="py-16 px-4 max-w-screen-2xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Form */}
					<div>
						<h2 className="font-heading text-xl text-primary tracking-widest uppercase mb-6">
							Send a Message
						</h2>
						<ContactForm />
					</div>

					{/* Contact info */}
					<div className="flex flex-col gap-6">
						<h2 className="font-heading text-xl text-primary tracking-widest uppercase">
							Get in Touch
						</h2>
						<div className="flex flex-col gap-4">
							<a
								href="https://maps.google.com/?q=Faculty+of+Technical+Sciences+Novi+Sad"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-start gap-4 text-text-gray hover:text-primary transition-colors"
							>
								<i
									className="fas fa-map-marker-alt text-primary text-xl mt-0.5"
									aria-hidden="true"
								/>
								<div>
									<p className="font-semibold text-text-light text-sm">
										Location
									</p>
									<p className="text-sm">University of Novi Sad, Serbia</p>
									<p className="text-xs mt-1">Faculty of Technical Sciences</p>
								</div>
							</a>
							<a
								href="mailto:formulastudentftn@gmail.com"
								className="flex items-center gap-4 text-text-gray hover:text-primary transition-colors"
							>
								<i
									className="fas fa-envelope text-primary text-xl"
									aria-hidden="true"
								/>
								<div>
									<p className="font-semibold text-text-light text-sm">Email</p>
									<p className="text-sm">formulastudentftn@gmail.com</p>
								</div>
							</a>
						</div>
					</div>
				</div>
			</section>

			<FaqSection />
		</>
	);
}
