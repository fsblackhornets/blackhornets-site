import Link from "next/link";
import { EmailIcon } from "@/components/icons/EmailIcon";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { PhoneIcon } from "@/components/icons/PhoneIcon";
import { QUICK_LINKS, SOCIAL_LINKS } from "./constants";

export function Footer() {
	return (
		<footer className="footer bg-bg-panel border-t border-gray-mid mt-auto">
			<div className="container max-w-screen-2xl mx-auto px-4 py-12">
				<div className="footer-content grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Brand */}
					<div className="footer-section brand flex flex-col gap-4">
						<span className="font-heading text-3xl font-bold text-primary leading-tight tracking-wide uppercase">
							Black<br />Hornets
						</span>
						<p className="tagline text-text-gray text-sm">
							Pioneering electric racing innovation
						</p>
						<div className="social-links flex gap-3">
							{SOCIAL_LINKS.map(({ href, Icon, label }) => (
								<a
									key={href}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="social-btn w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center text-primary hover:border-primary hover:bg-primary/10 transition-colors"
								>
									<Icon className="w-4 h-4" />
									<span className="sr-only">{label}</span>
								</a>
							))}
						</div>
					</div>

					{/* Quick links */}
					<div className="footer-section links">
						<h3 className="text-primary font-heading text-sm tracking-widest uppercase mb-4">
							Quick Links
						</h3>
						<div className="link-grid grid grid-cols-2 gap-2">
							{QUICK_LINKS.map(({ href, label }) => (
								<Link
									key={href}
									href={href}
									className="footer-link text-text-gray hover:text-primary text-sm flex items-center gap-1.5 transition-colors"
								>
									{label}
								</Link>
							))}
						</div>
					</div>

					{/* Contact */}
					<div className="footer-section contact">
						<h3 className="text-primary font-heading text-sm tracking-widest uppercase mb-4">
							Contact Us
						</h3>
						<div className="contact-info flex flex-col gap-3">
							<a
								href="https://maps.google.com/?q=Faculty+of+Technical+Sciences+Novi+Sad"
								target="_blank"
								rel="noopener noreferrer"
								className="contact-item text-text-gray hover:text-primary text-sm flex items-start gap-2 transition-colors"
							>
								<LocationIcon className="w-4 h-4 mt-0.5 shrink-0" />
								University of Novi Sad, Serbia
							</a>
							<a
								href="mailto:formulastudentftn@gmail.com"
								className="contact-item text-text-gray hover:text-primary text-sm flex items-center gap-2 transition-colors"
							>
								<EmailIcon className="w-4 h-4 shrink-0" />
								formulastudentftn@gmail.com
							</a>
							<a
								href="tel:+38162782568"
								className="contact-item text-text-gray hover:text-primary text-sm flex items-center gap-2 transition-colors"
							>
								<PhoneIcon className="w-4 h-4 shrink-0" />
								+381 62 782 568
							</a>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="footer-bottom mt-8 pt-6 border-t border-gray-mid flex items-center justify-between text-text-gray text-xs gap-4 flex-wrap">
					<p className="copyright">
						&copy; {new Date().getFullYear()} Black Hornets Racing
					</p>
					<p>Powered by CodeHive</p>
				</div>
			</div>
		</footer>
	);
}
