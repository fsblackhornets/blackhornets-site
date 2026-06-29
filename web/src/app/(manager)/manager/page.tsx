import Link from "next/link";
import { auth } from "@/auth";
import { QUICK_ACTIONS } from "@/components/manager/constants";
import { fetchRequests } from "@/lib/api/requests";

export const metadata = { title: "Dashboard — Manager Panel" };

const QUICK_ACTION_ICONS: Record<string, React.ReactNode> = {
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
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="rgba(255,215,0,0.6)"
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							{QUICK_ACTION_ICONS[icon] ?? null}
						</svg>
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
					<svg
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(255,215,0,0.25)"
						strokeWidth={1.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mx-auto mb-3"
						aria-hidden="true"
					>
						<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
						<path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
					</svg>
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
