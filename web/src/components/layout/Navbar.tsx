"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ApplyButton } from "./components/ApplyButton";
import { NAV_LINKS } from "./constants";

export function Navbar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	return (
		<header className="main-header sticky top-0 z-50 bg-bg-dark/90 backdrop-blur border-b border-gray-mid">
			<nav className="navbar max-w-7xl mx-auto px-4 h-[70px] flex items-center justify-between gap-4">
				{/* Brand */}
				<Link
					href="/"
					className="nav-brand shrink-0"
					onClick={() => setOpen(false)}
				>
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
					{NAV_LINKS.map(({ href, label, icon }) => (
						<Link
							key={href}
							href={href}
							className={`nav-link px-3 py-1.5 rounded-lg text-sm font-body font-medium transition-colors flex items-center gap-1.5
                ${
									pathname.startsWith(href)
										? "text-primary bg-primary/10 active"
										: "text-text-light hover:text-primary hover:bg-primary/5"
								}`}
						>
							<i className={icon} aria-hidden="true" />
							{label}
						</Link>
					))}
				</div>

				{/* Apply CTA */}
				<ApplyButton className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm shrink-0" />

				{/* Mobile toggle */}
				<button
					type="button"
					className="mobile-toggle md:hidden flex flex-col gap-1.5 p-2"
					aria-label={open ? "Close menu" : "Open menu"}
					onClick={() => setOpen((v) => !v)}
				>
					<span
						className={`block w-6 h-0.5 bg-primary transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
					/>
					<span
						className={`block w-6 h-0.5 bg-primary transition-all ${open ? "opacity-0" : ""}`}
					/>
					<span
						className={`block w-6 h-0.5 bg-primary transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
					/>
				</button>
			</nav>

			{/* Mobile menu */}
			{open && (
				<div className="md:hidden bg-bg-panel border-t border-gray-mid px-4 py-4 flex flex-col gap-2">
					{NAV_LINKS.map(({ href, label, icon }) => (
						<Link
							key={href}
							href={href}
							onClick={() => setOpen(false)}
							className={`nav-link px-3 py-2 rounded-lg font-body flex items-center gap-2
                ${pathname.startsWith(href) ? "text-primary bg-primary/10" : "text-text-light"}`}
						>
							<i className={icon} aria-hidden="true" />
							{label}
						</Link>
					))}
					<ApplyButton
						className="mt-2 px-3 py-2 text-center"
						onClick={() => setOpen(false)}
					/>
				</div>
			)}
		</header>
	);
}
