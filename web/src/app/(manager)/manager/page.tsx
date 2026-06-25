import Link from "next/link";
import { auth } from "@/auth";
import { QUICK_ACTIONS } from "@/components/manager/constants";
import { REQUEST_STATUS_COLORS } from "@/constants/requests";
import { fetchRequests } from "@/lib/api/requests";

export const metadata = { title: "Dashboard — Manager Panel" };

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
			<div className="mb-8">
				<h1 className="font-heading text-2xl text-primary tracking-widest uppercase mb-1">
					Welcome, {name}
				</h1>
				<p className="text-text-gray text-sm">
					Submit content requests for admin review.
				</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4 mb-8">
				{[
					{ label: "Pending", value: pending, color: "text-yellow-400" },
					{ label: "Approved", value: approved, color: "text-green-400" },
					{ label: "Declined", value: declined, color: "text-red-400" },
				].map(({ label, value, color }) => (
					<div
						key={label}
						className="bg-[#111] border border-primary/10 rounded-xl p-4"
					>
						<p className={`font-heading text-2xl font-bold ${color}`}>{value}</p>
						<p className="text-text-gray text-xs mt-1">{label} requests</p>
					</div>
				))}
			</div>

			{/* Quick actions */}
			<h2 className="font-heading text-xs tracking-[3px] uppercase text-text-gray/50 mb-3">
				New Request
			</h2>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
				{QUICK_ACTIONS.map(({ href, icon, label, desc }) => (
					<Link
						key={href}
						href={href}
						className="bg-[#111] border border-primary/10 hover:border-primary/30 rounded-xl p-4 flex flex-col gap-2 transition-colors group"
					>
						<i
							className={`${icon} text-primary text-lg`}
							aria-hidden="true"
						/>
						<p className="text-text-light text-sm font-semibold group-hover:text-primary transition-colors">
							{label}
						</p>
						<p className="text-text-gray text-xs leading-snug">{desc}</p>
					</Link>
				))}
			</div>

			{/* Recent requests */}
			<div className="flex items-center justify-between mb-3">
				<h2 className="font-heading text-xs tracking-[3px] uppercase text-text-gray/50">
					Recent Requests
				</h2>
				<Link
					href="/manager/requests"
					className="text-primary text-xs hover:underline"
				>
					View all
				</Link>
			</div>

			{recent.length === 0 ? (
				<p className="text-text-gray text-sm py-6 text-center border border-primary/10 rounded-xl">
					No requests yet.
				</p>
			) : (
				<div className="flex flex-col gap-2">
					{recent.map((r) => (
						<div
							key={r.id}
							className="bg-[#111] border border-primary/10 rounded-xl px-4 py-3 flex items-center justify-between gap-4"
						>
							<div className="flex items-center gap-3 min-w-0">
								<span className="text-text-gray text-xs uppercase tracking-widest font-heading shrink-0">
									{r.type}
								</span>
								<span className="text-text-light text-sm truncate">
									{String(
										(r.data as Record<string, unknown>).name ??
											(r.data as Record<string, unknown>).title_sr ??
											(r.data as Record<string, unknown>).full_name ??
											"—",
									)}
								</span>
							</div>
							<span
								className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${REQUEST_STATUS_COLORS[r.status] ?? ""}`}
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
