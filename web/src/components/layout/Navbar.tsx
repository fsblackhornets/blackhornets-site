"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useScrolled } from "@/hooks/useScrolled";
import { NAV_LINKS } from "./constants";

export function Navbar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const scrolled = useScrolled(20);

	return (
		<header
			className="sticky top-0 z-50 backdrop-blur transition-all duration-300"
			style={{
				background: scrolled ? "rgba(17,17,17,0.97)" : "rgba(17,17,17,0.90)",
				borderBottom: "1px solid #2c2c2c",
			}}
		>
			{/* Racing stripe */}
			<div className="flex w-full" style={{ height: "3px" }}>
				<div style={{ flex: 1, background: "#ffd700" }} />
				<div style={{ flex: 0.12, background: "#080808" }} />
				<div style={{ flex: 0.05, background: "#ffd700" }} />
			</div>

			<nav
				className={`max-w-screen-2xl mx-auto px-4 flex items-center justify-between gap-4 transition-all duration-300 ${
					scrolled ? "h-[48px]" : "h-[64px]"
				}`}
			>
				{/* Brand */}
				<Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
					<Image
						src="/images/stiker.png"
						alt="Black Hornets Logo"
						width={48}
						height={48}
						className="h-10 w-auto drop-shadow-[0_0_12px_rgba(255,215,0,0.35)] hover:scale-105 transition-transform duration-300"
						priority
					/>
				</Link>

				{/* Desktop links */}
				<div className="hidden md:flex items-center gap-6">
					<Link
						href="/"
						className="font-body text-sm transition-colors pb-0.5"
						style={{
							color: pathname === "/" ? "#ffd700" : "#aaaaaa",
							borderBottom:
								pathname === "/"
									? "1.5px solid #ffd700"
									: "1.5px solid transparent",
						}}
					>
						Home
					</Link>
					{NAV_LINKS.map(({ href, label }) => {
						const active = pathname.startsWith(href);
						return (
							<Link
								key={href}
								href={href}
								className="font-body text-sm transition-colors pb-0.5"
								style={{
									color: active ? "#ffd700" : "#aaaaaa",
									borderBottom: active
										? "1.5px solid #ffd700"
										: "1.5px solid transparent",
								}}
							>
								{label}
							</Link>
						);
					})}
				</div>

				{/* CTA */}
				<Link
					href="/apply"
					className="hidden md:inline-flex items-center px-6 py-2 font-heading font-bold text-black text-xs tracking-widest bg-primary shrink-0 hover:bg-yellow-400 transition-colors duration-300 ml-6"
					style={{
						clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
					}}
				>
					Apply Now
				</Link>

				{/* Mobile toggle */}
				<button
					type="button"
					className="md:hidden flex flex-col gap-1.5 p-2"
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
				style={{ maxHeight: open ? "500px" : "0px" }}
			>
				<div
					className="px-4 py-4 flex flex-col gap-1"
					style={{ background: "#1a1a1a", borderTop: "1px solid #2c2c2c" }}
				>
					<Link
						href="/"
						onClick={() => setOpen(false)}
						className="flex items-center justify-between py-2.5 font-body text-sm transition-colors"
						style={{
							color: pathname === "/" ? "#ffd700" : "#aaaaaa",
							borderLeft:
								pathname === "/"
									? "2px solid #ffd700"
									: "2px solid transparent",
							paddingLeft: "12px",
						}}
					>
						Home
						<span style={{ color: "#ffd700", fontSize: "1rem" }}>›</span>
					</Link>
					{NAV_LINKS.map(({ href, label }) => {
						const active = pathname.startsWith(href);
						return (
							<Link
								key={href}
								href={href}
								onClick={() => setOpen(false)}
								className="flex items-center justify-between py-2.5 font-body text-sm transition-colors"
								style={{
									color: active ? "#ffd700" : "#aaaaaa",
									borderLeft: active
										? "2px solid #ffd700"
										: "2px solid transparent",
									paddingLeft: "12px",
								}}
							>
								{label}
								<span style={{ color: "#ffd700", fontSize: "1rem" }}>›</span>
							</Link>
						);
					})}
					<Link
						href="/apply"
						onClick={() => setOpen(false)}
						className="mt-3 flex items-center justify-center py-3 font-heading font-bold text-black text-xs tracking-widest bg-primary hover:bg-yellow-400 transition-colors duration-300"
						style={{
							clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
						}}
					>
						Apply Now
					</Link>
				</div>
			</div>
		</header>
	);
}
