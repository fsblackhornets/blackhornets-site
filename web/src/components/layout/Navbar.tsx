"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { setLocale } from "@/app/actions/setLocale";
import { NAV_LINKS } from "@/constants/links";
import { useScrolled } from "@/hooks/useScrolled";
import type { Locale } from "@/i18n/routing";

const NAV_KEYS: Record<string, string> = {
	"/team": "team",
	"/about": "about",
	"/projects": "projects",
	"/blog": "blog",
	"/gallery": "gallery",
	"/sponsors": "sponsors",
	"/contact": "contact",
};

function LangSwitcher() {
	const locale = useLocale() as Locale;
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	const other: Locale = locale === "sr" ? "en" : "sr";

	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				startTransition(async () => {
					await setLocale(other);
					router.refresh();
				})
			}
			className="font-heading text-[7px] tracking-[3px] uppercase px-3 py-1.5 border transition-colors duration-200 disabled:opacity-50"
			style={{
				clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
				border: "1px solid rgba(255,215,0,0.4)",
				color: "#ffd700",
				background: "transparent",
			}}
		>
			{other.toUpperCase()}
		</button>
	);
}

export function Navbar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const scrolled = useScrolled(20);
	const t = useTranslations("nav");

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
						style={{ width: "auto" }}
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
						{t("home")}
					</Link>
					{NAV_LINKS.map(({ href }) => {
						const active = pathname.startsWith(href);
						const key = NAV_KEYS[href] ?? "";
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
								{key ? t(key as Parameters<typeof t>[0]) : href}
							</Link>
						);
					})}
				</div>

				{/* Right side: lang switcher + CTA */}
				<div className="hidden md:flex items-center gap-3 ml-6 shrink-0">
					<LangSwitcher />
					<Link
						href="/apply"
						className="inline-flex items-center px-6 py-2 font-heading font-bold text-black text-xs tracking-widest bg-primary hover:bg-yellow-400 transition-colors duration-300"
						style={{
							clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
						}}
					>
						{t("applyNow")}
					</Link>
				</div>

				{/* Mobile toggle */}
				<button
					type="button"
					className="md:hidden flex flex-col gap-1.5 p-2"
					aria-label={open ? t("closeMenu") : t("openMenu")}
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
				style={{ maxHeight: open ? "600px" : "0px" }}
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
						{t("home")}
						<span style={{ color: "#ffd700", fontSize: "1rem" }}>›</span>
					</Link>
					{NAV_LINKS.map(({ href }) => {
						const active = pathname.startsWith(href);
						const key = NAV_KEYS[href] ?? "";
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
								{key ? t(key as Parameters<typeof t>[0]) : href}
								<span style={{ color: "#ffd700", fontSize: "1rem" }}>›</span>
							</Link>
						);
					})}

					{/* Mobile lang switcher */}
					<div className="mt-2 flex justify-start pl-3">
						<LangSwitcher />
					</div>

					<Link
						href="/apply"
						onClick={() => setOpen(false)}
						className="mt-3 flex items-center justify-center py-3 font-heading font-bold text-black text-xs tracking-widest bg-primary hover:bg-yellow-400 transition-colors duration-300"
						style={{
							clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
						}}
					>
						{t("applyNow")}
					</Link>
				</div>
			</div>
		</header>
	);
}
