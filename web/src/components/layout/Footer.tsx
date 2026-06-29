import Link from "next/link";
import { EmailIcon } from "@/components/icons/EmailIcon";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { QUICK_LINKS, SOCIAL_LINKS } from "@/constants/layout";

export function Footer() {
	return (
		<footer className="mt-auto" style={{ background: "#111111" }}>
			{/* Racing stripe */}
			<div className="flex w-full" style={{ height: "3px" }}>
				<div style={{ flex: 1, background: "#ffd700" }} />
				<div style={{ flex: 0.12, background: "#080808" }} />
				<div style={{ flex: 0.05, background: "#ffd700" }} />
			</div>

			<div className="relative overflow-hidden">
				{/* BHR watermark */}
				<div
					className="absolute bottom-0 right-0 pointer-events-none select-none font-heading font-black text-white"
					aria-hidden="true"
					style={{
						fontSize: "clamp(8rem, 25vw, 20rem)",
						opacity: 0.022,
						lineHeight: 1,
						transform: "translate(10%, 20%)",
					}}
				>
					BHR
				</div>

				<div className="relative z-10 max-w-screen-2xl mx-auto px-4 py-14">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-10">
						{/* Brand */}
						<div className="flex flex-col gap-5">
							<div
								className="font-heading font-black leading-[1.05]"
								style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)" }}
							>
								<span className="block text-white">Black</span>
								<span
									className="block"
									style={{
										background: "linear-gradient(90deg, #ffd700, #ffc107)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										backgroundClip: "text",
									}}
								>
									Hornets
								</span>
								<span className="block text-white">Racing</span>
							</div>
							<p className="font-body text-text-gray text-sm leading-relaxed">
								Pioneering electric racing innovation
							</p>
							<div className="flex gap-2.5">
								{SOCIAL_LINKS.map(({ href, Icon, label }) => (
									<a
										key={href}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-colors duration-300"
										style={{ border: "1px solid rgba(255,215,0,0.4)" }}
									>
										<Icon className="w-4 h-4" />
										<span className="sr-only">{label}</span>
									</a>
								))}
							</div>
						</div>

						{/* Quick Links */}
						<div>
							<h3 className="font-heading text-xs tracking-widest uppercase text-primary mb-5">
								Quick Links
							</h3>
							<div className="flex flex-col gap-2.5">
								{QUICK_LINKS.map(({ href, label }) => (
									<Link
										key={href}
										href={href}
										className="font-body text-sm text-text-gray hover:text-primary transition-colors flex items-center gap-2"
									>
										<span style={{ color: "#ffd700", fontSize: "0.75rem" }}>
											—
										</span>
										{label}
									</Link>
								))}
							</div>
						</div>

						{/* Get Involved */}
						<div>
							<h3 className="font-heading text-xs tracking-widest uppercase text-primary mb-5">
								Get Involved
							</h3>
							<div className="flex flex-col gap-2.5 mb-5">
								{[
									{ href: "/apply", label: "Apply to Team" },
									{ href: "/sponsors", label: "Become a Sponsor" },
									{ href: "/gallery", label: "Gallery" },
								].map(({ href, label }) => (
									<Link
										key={href}
										href={href}
										className="font-body text-sm text-text-gray hover:text-primary transition-colors flex items-center gap-2"
									>
										<span style={{ color: "#ffd700", fontSize: "0.75rem" }}>
											—
										</span>
										{label}
									</Link>
								))}
							</div>
							<Link
								href="/apply"
								className="inline-flex items-center px-6 py-2.5 font-heading font-bold text-black text-xs tracking-widest bg-primary hover:bg-yellow-400 transition-colors duration-300"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
								}}
							>
								Apply Now
							</Link>
						</div>

						{/* Contact */}
						<div>
							<h3 className="font-heading text-xs tracking-widest uppercase text-primary mb-5">
								Contact Us
							</h3>
							<div className="flex flex-col gap-3.5">
								<a
									href="https://maps.google.com/?q=Faculty+of+Technical+Sciences+Novi+Sad"
									target="_blank"
									rel="noopener noreferrer"
									className="font-body text-text-gray text-sm flex items-start gap-3 hover:text-primary transition-colors"
								>
									<LocationIcon className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
									University of Novi Sad, Serbia
								</a>
								<a
									href="mailto:formulastudentftn@gmail.com"
									className="font-body text-text-gray text-sm flex items-center gap-3 hover:text-primary transition-colors"
								>
									<EmailIcon className="w-4 h-4 shrink-0 text-primary" />
									formulastudentftn@gmail.com
								</a>
								<a
									href="tel:+38162782568"
									className="font-body text-text-gray text-sm flex items-center gap-3 hover:text-primary transition-colors"
								>
									<PhoneIcon className="w-4 h-4 shrink-0 text-primary" />
									+381 62 782 568
								</a>
							</div>
						</div>
					</div>

					{/* Bottom bar */}
					<div
						className="mt-10 pt-6 flex items-center justify-between flex-wrap gap-4"
						style={{ borderTop: "1px solid #2c2c2c" }}
					>
						<p className="font-body text-xs" style={{ color: "#555555" }}>
							&copy; {new Date().getFullYear()} Black Hornets Racing
						</p>
						<p className="font-body text-xs" style={{ color: "#555555" }}>
							Privacy Policy · Powered by CodeHive
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
