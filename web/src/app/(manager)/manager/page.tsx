import { FileEdit, Heart, Image as ImageIcon, Inbox, Settings, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { QUICK_ACTIONS } from "@/components/manager/constants";
import { fetchRequests } from "@/lib/api/requests";

export const metadata = { title: "Dashboard — Manager Panel" };

const QUICK_ACTION_ICONS: Record<string, LucideIcon> = {
	edit: FileEdit,
	gear: Settings,
	heart: Heart,
	users: Users,
	image: ImageIcon,
};

const STATUS_BORDER: Record<string, string> = {
	pending: "border-l-primary",
	approved: "border-l-green-500",
	declined: "border-l-red-600",
};

const STATUS_BADGE: Record<string, string> = {
	pending: "bg-primary/10 text-primary",
	approved: "bg-green-500/10 text-green-400",
	declined: "bg-red-500/10 text-red-400",
};

const STAT_BORDER: Record<string, string> = {
	Pending: "border-t-primary",
	Approved: "border-t-green-500",
	Declined: "border-t-red-600",
};

export default async function ManagerDashboard() {
	const session = await auth();
	const userId = Number(session?.user?.id ?? 0);
	const name = session?.user?.full_name ?? "Manager";

	const requests = await fetchRequests({ userId, role: "manager" });
	const pending = requests.filter((r) => r.status === "pending").length;
	const approved = requests.filter((r) => r.status === "approved").length;
	const declined = requests.filter((r) => r.status === "declined").length;
	const recent = requests.slice(0, 5);

	return (
		<div className="max-w-[900px]">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-heading text-[16px] tracking-[2px] uppercase text-primary mb-1">
					Welcome, {name}
				</h1>
				<p className="font-body text-[9px] text-[#444]">
					Submit content requests for admin review.
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4 mb-8">
				{[
					{ label: "Pending", value: pending },
					{ label: "Approved", value: approved },
					{ label: "Declined", value: declined },
				].map(({ label, value }) => (
					<div
						key={label}
						className={`bg-[#111] border border-[#1e1e1e] border-t-2 rounded-sm p-4 ${STAT_BORDER[label]}`}
					>
						<p className="font-heading text-[22px] text-white">{value}</p>
						<p className="font-body text-[8px] tracking-[2px] uppercase text-[#444] mt-1">
							{label} requests
						</p>
					</div>
				))}
			</div>

			{/* Quick actions */}
			<h2 className="font-heading text-[7px] tracking-[4px] uppercase text-[#333] mb-3">
				New Request
			</h2>
			<div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
				{QUICK_ACTIONS.map(({ href, icon, label, desc }) => (
					<Link
						key={href}
						href={href}
						className="bg-[#111] border border-[#1e1e1e] hover:border-primary/30 rounded-sm p-4 flex flex-col gap-2 transition-colors group"
					>
						{(() => { const Icon = QUICK_ACTION_ICONS[icon]; return Icon ? <Icon size={18} strokeWidth={1.5} stroke="rgba(255,215,0,0.6)" aria-hidden="true" /> : null; })()}
						<p className="font-body font-semibold text-[9px] text-[#ccc] group-hover:text-primary transition-colors">
							{label}
						</p>
						<p className="font-body text-[8px] text-[#3a3a3a] leading-snug">
							{desc}
						</p>
					</Link>
				))}
			</div>

			{/* Recent requests */}
			<div className="flex items-center justify-between mb-3">
				<h2 className="font-heading text-[7px] tracking-[4px] uppercase text-[#333]">
					Recent Requests
				</h2>
				<Link
					href="/manager/requests"
					className="font-heading text-[7px] tracking-[2px] uppercase text-primary hover:underline"
				>
					View all
				</Link>
			</div>

			{recent.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<Inbox size={32} strokeWidth={1.5} stroke="rgba(255,215,0,0.25)" className="mx-auto mb-3" aria-hidden="true" />
					<p className="font-heading text-[9px] tracking-[3px] uppercase text-[#333]">
						No requests yet
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{recent.map((r) => (
						<div
							key={r.id}
							className={`bg-[#111] border border-[#1e1e1e] border-l-[3px] rounded-sm px-4 py-3 flex items-center justify-between gap-4 ${STATUS_BORDER[r.status] ?? "border-l-[#333]"}`}
						>
							<div className="flex items-center gap-3 min-w-0">
								<span className="font-heading text-[7px] tracking-[2px] uppercase text-[#555] shrink-0">
									{r.type}
								</span>
								<span className="font-body text-[10px] text-[#e0e0e0] truncate">
									{String(
										(r.data as Record<string, unknown>).name ??
											(r.data as Record<string, unknown>).title_sr ??
											(r.data as Record<string, unknown>).full_name ??
											"—",
									)}
								</span>
							</div>
							<span
								className={`font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1.5 shrink-0 ${STATUS_BADGE[r.status] ?? ""}`}
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
								}}
							>
								{r.status}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
