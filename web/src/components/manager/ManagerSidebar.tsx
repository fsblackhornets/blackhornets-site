"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileEdit, Heart, Hexagon, Image, LayoutGrid, LogOut, Settings, Users } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { MANAGER_NAV } from "./constants";

interface ManagerSidebarProps {
	userName: string;
	userRole: string;
}

const NAV_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
	grid: LayoutGrid,
	activity: Activity,
	edit: FileEdit,
	gear: Settings,
	heart: Heart,
	users: Users,
	image: Image,
};

function NavIcon({ name }: { name: string }) {
	const Icon = NAV_ICONS[name];
	if (!Icon) return null;
	return <Icon size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} />;
}

export function ManagerSidebar({ userName, userRole }: ManagerSidebarProps) {
	const pathname = usePathname();

	return (
		<aside className="fixed top-0 left-0 bottom-0 w-[240px] bg-[#070707] border-r border-primary/8 flex flex-col z-40">
			{/* Logo */}
			<div className="flex items-center gap-3 px-4 h-[56px] border-b border-primary/8 shrink-0">
				<div className="w-[30px] h-[30px] rounded-full border-[1.5px] border-primary/40 bg-primary/5 flex items-center justify-center shrink-0">
					<Hexagon size={14} strokeWidth={1.5} stroke="rgba(255,215,0,0.7)" aria-hidden="true" />
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
						<LogOut size={13} strokeWidth={1.5} aria-hidden="true" />
					</button>
				</form>
			</div>
		</aside>
	);
}
