"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/team",     label: "Team" },
  { href: "/about",    label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery",  label: "Gallery" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact",  label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="main-header sticky top-0 z-50 bg-bg-dark/90 backdrop-blur border-b border-gray-mid">
      <nav className="navbar max-w-7xl mx-auto px-4 h-[70px] flex items-center justify-between gap-4">

        {/* Brand */}
        <Link href="/" className="nav-brand shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Black Hornets Logo"
            width={48}
            height={48}
            className="nav-logo h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="nav-links hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors
                ${pathname.startsWith(href)
                  ? "text-primary bg-primary/10 active"
                  : "text-text-light hover:text-primary hover:bg-primary/5"}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Apply CTA */}
        <Link
          href="/apply"
          className={`apply-btn hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg
            border-2 border-primary text-primary text-sm font-semibold font-body
            hover:bg-primary hover:text-bg-dark transition-colors shrink-0
            ${pathname === "/apply" ? "bg-primary text-bg-dark active" : ""}`}
        >
          Apply
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className="mobile-toggle md:hidden flex flex-col gap-1.5 p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block w-6 h-0.5 bg-primary transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-primary transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-primary transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-bg-panel border-t border-gray-mid px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`nav-link px-3 py-2 rounded-lg font-body
                ${pathname.startsWith(href) ? "text-primary bg-primary/10" : "text-text-light"}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/apply"
            onClick={() => setOpen(false)}
            className="apply-btn mt-2 px-3 py-2 rounded-lg border-2 border-primary
              text-primary font-semibold text-center hover:bg-primary hover:text-bg-dark transition-colors"
          >
            Apply
          </Link>
        </div>
      )}
    </header>
  );
}
