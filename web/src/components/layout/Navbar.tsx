"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useScrolled } from "@/hooks/useScrolled";
import { ApplyButton } from "./components/ApplyButton";
import { NAV_LINKS } from "./constants";

export function Navbar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const scrolled = useScrolled(20);

	return (
		<header className={`main-header sticky top-0 z-50 backdrop-blur border-b border-gray-mid transition-all duration-300 ${scrolled ? "bg-bg-dark/95 shadow-lg" : "bg-bg-dark/90"}`}>
			<nav className={`navbar max-w-screen-2xl mx-auto px-4 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "h-[52px]" : "h-[70px]"}`}>
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
						style={{ filter: "brightness(0) saturate(100%) invert(87%) sepia(69%) saturate(1009%) hue-rotate(356deg) brightness(104%) contrast(101%)" }}
						priority
					/>
				</Link>

				{/* Desktop links */}
				<div className="nav-links hidden md:flex items-center gap-1">
					{NAV_LINKS.map(({ href, label, Icon }) => (
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
							<Icon className="w-4 h-4 shrink-0" />
							{label}
						</Link>
					))}
				</div>

				{/* Apply CTA */}
				<ApplyButton className="hidden md:flex shrink-0" />

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
			<div
				className="md:hidden overflow-hidden transition-all duration-300"
				style={{ maxHeight: open ? "400px" : "0px" }}
			>
				<div className="bg-bg-panel border-t border-gray-mid px-4 py-4 flex flex-col gap-2">
					{NAV_LINKS.map(({ href, label, Icon }) => (
						<Link
							key={href}
							href={href}
							onClick={() => setOpen(false)}
							className={`nav-link px-3 py-2 rounded-lg font-body flex items-center gap-2
                ${pathname.startsWith(href) ? "text-primary bg-primary/10" : "text-text-light"}`}
						>
							<Icon className="w-4 h-4 shrink-0" />
							{label}
						</Link>
					))}
					<ApplyButton
						className="mt-2 px-3 py-2 text-center"
						onClick={() => setOpen(false)}
					/>
				</div>
			</div>
		</header>
	);
}
