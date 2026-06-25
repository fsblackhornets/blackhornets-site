import Link from "next/link";
import Image from "next/image";

const SOCIAL = [
  { href: "https://www.facebook.com", icon: "fab fa-facebook-f", label: "Facebook" },
  { href: "https://www.instagram.com/blackhornets.ns/", icon: "fab fa-instagram", label: "Instagram" },
  { href: "https://www.linkedin.com", icon: "fab fa-linkedin-in", label: "LinkedIn" },
  { href: "https://www.youtube.com", icon: "fab fa-youtube", label: "YouTube" },
] as const;

const QUICK_LINKS = [
  { href: "/about",    label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/team",     label: "Team" },
  { href: "/contact",  label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="footer bg-bg-panel border-t border-gray-mid mt-auto">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="footer-content grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="footer-section brand flex flex-col gap-4">
            <Image
              src="/images/logo-text.png"
              alt="Black Hornets"
              width={160}
              height={48}
              className="footer-logo h-12 w-auto"
            />
            <p className="tagline text-text-gray text-sm">
              Pioneering electric racing innovation
            </p>
            <div className="social-links flex gap-3">
              {SOCIAL.map(({ href, icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-btn w-9 h-9 rounded-full border border-gray-mid flex items-center
                    justify-center text-text-gray hover:text-primary hover:border-primary transition-colors"
                >
                  <i className={icon} aria-hidden="true" />
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
                  <i className="fas fa-chevron-right text-xs" aria-hidden="true" />
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
                <i className="fas fa-map-marker-alt mt-0.5 shrink-0" aria-hidden="true" />
                University of Novi Sad, Serbia
              </a>
              <a
                href="mailto:formulastudentftn@gmail.com"
                className="contact-item text-text-gray hover:text-primary text-sm flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-envelope shrink-0" aria-hidden="true" />
                formulastudentftn@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom mt-8 pt-6 border-t border-gray-mid flex items-center justify-between text-text-gray text-xs gap-4 flex-wrap">
          <p className="copyright">&copy; {new Date().getFullYear()} Black Hornets Racing</p>
          <p>Powered by CodeHive</p>
        </div>
      </div>
    </footer>
  );
}
