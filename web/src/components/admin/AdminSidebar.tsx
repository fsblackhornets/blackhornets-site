"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { ADMIN_NAV } from "@/constants/admin";

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<aside className="fixed top-0 left-0 bottom-0 w-[240px] bg-[#0a0a0a] border-r border-primary/10 flex flex-col z-40">
			<div className="flex items-center gap-3 px-5 h-[60px] border-b border-primary/10 shrink-0">
				<Image
					src="/images/logo.png"
					alt="Black Hornets"
					width={32}
					height={32}
				/>
				<span className="font-heading text-xs tracking-widest text-primary uppercase">
					Admin
				</span>
			</div>

			<nav className="flex-1 overflow-y-auto py-4 px-3">
				{ADMIN_NAV.map(({ section, items }) => (
					<div key={section} className="mb-5">
						<p className="px-2 mb-1.5 text-[10px] tracking-[3px] uppercase text-text-gray/50 font-semibold">
							{section}
						</p>
						{items.map(({ href, Icon, label }) => {
							const active =
								href === "/admin"
									? pathname === "/admin"
									: pathname.startsWith(href);
							return (
								<Link
									key={href}
									href={href}
									className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5
										${active ? "bg-primary/10 text-primary font-semibold" : "text-text-gray hover:text-text-light hover:bg-white/5"}`}
								>
									<Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
									{label}
								</Link>
							);
						})}
					</div>
				))}
			</nav>

			<div className="px-3 py-4 border-t border-primary/10 shrink-0">
				<form action={logoutAction}>
					<button
						type="submit"
						className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-gray hover:text-red-400 hover:bg-red-500/10 transition-colors"
					>
						<LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
						Sign Out
					</button>
				</form>
			</div>
		</aside>
	);
}
