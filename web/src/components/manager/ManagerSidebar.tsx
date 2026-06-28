"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { MANAGER_NAV } from "./constants";

interface ManagerSidebarProps {
	userName: string;
	userRole: string;
}

const NAV_ICON_PATHS: Record<string, React.ReactNode> = {
	grid: (
		<>
			<rect x="3" y="3" width="7" height="7" />
			<rect x="14" y="3" width="7" height="7" />
			<rect x="3" y="14" width="7" height="7" />
			<rect x="14" y="14" width="7" height="7" />
		</>
	),
	activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
	edit: (
		<>
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
		</>
	),
	gear: (
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</>
	),
	heart: (
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
	),
	users: (
		<>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</>
	),
	image: (
		<>
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
			<circle cx="8.5" cy="8.5" r="1.5" />
			<polyline points="21 15 16 10 5 21" />
		</>
	),
};

function NavIcon({ name }: { name: string }) {
	return (
		<svg
			width="13"
			height="13"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			style={{ flexShrink: 0 }}
		>
			{NAV_ICON_PATHS[name] ?? null}
		</svg>
	);
}

export function ManagerSidebar({ userName, userRole }: ManagerSidebarProps) {
	const pathname = usePathname();

	return (
		<aside className="fixed top-0 left-0 bottom-0 w-[240px] bg-[#070707] border-r border-primary/8 flex flex-col z-40">
			{/* Logo */}
			<div className="flex items-center gap-3 px-4 h-[56px] border-b border-primary/8 shrink-0">
				<div className="w-[30px] h-[30px] rounded-full border-[1.5px] border-primary/40 bg-primary/5 flex items-center justify-center shrink-0">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(255,215,0,0.7)"
						strokeWidth={1.5}
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<polygon points="12 2 22 7 22 17 12 22 2 17 2 7" />
					</svg>
				</div>
				<span className="font-heading text-[9px] tracking-[2px] uppercase text-primary">
					Manager
				</span>
			</div>

			{/* Nav */}
			<nav className="flex-1 overflow-y-auto py-4 px-3">
				{MANAGER_NAV.map(({ section, items }) => (
					<div key={section} className="mb-5">
						<p className="px-2 mb-1.5 text-[7px] tracking-[3px] uppercase text-[#333] font-semibold">
							{section}
						</p>
						{items.map(({ href, icon, label }) => {
							const active =
								href === "/manager"
									? pathname === "/manager"
									: pathname.startsWith(href);
							return (
								<Link
									key={href}
									href={href}
									className={`flex items-center gap-2.5 px-3 py-2 rounded-none text-[10px] font-body transition-colors mb-0.5 ${
										active
											? "bg-primary/8 border border-primary/15 text-primary font-semibold"
											: "text-[#444] hover:text-[#888] hover:bg-white/[3%]"
									}`}
								>
									<NavIcon name={icon} />
									{label}
								</Link>
							);
						})}
					</div>
				))}
			</nav>

			{/* User section */}
			<div className="border-t border-primary/8 p-3 flex items-center gap-2.5 shrink-0">
				<div className="w-[30px] h-[30px] rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-heading text-[11px] text-primary shrink-0">
					{userName.charAt(0).toUpperCase()}
				</div>
				<div className="flex flex-col min-w-0 flex-1">
					<span className="text-[9px] text-[#ccc] truncate">{userName}</span>
					<span className="text-[7.5px] text-[#444] capitalize">
						{userRole.replace(/_/g, " ")}
					</span>
				</div>
				<form action={logoutAction}>
					<button
						type="submit"
						className="text-[#444] hover:text-primary transition-colors"
						aria-label="Logout"
					>
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" y1="12" x2="9" y2="12" />
						</svg>
					</button>
				</form>
			</div>
		</aside>
	);
}
