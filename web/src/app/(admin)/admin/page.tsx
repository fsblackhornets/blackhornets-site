import { auth } from "@/auth";
import {
	QUICK_ACTIONS,
	STAT_CARDS,
	TEAM_BREAKDOWN,
} from "@/components/admin/constants";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { StatCard } from "@/components/admin/StatCard";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchDashboardStats } from "@/lib/api/admin";

export const metadata = buildAdminMeta("Dashboard");

export default async function AdminDashboard() {
	const [session, stats] = await Promise.all([auth(), fetchDashboardStats()]);
	const name = session?.user?.full_name ?? "Admin";

	return (
		<div className="max-w-[1100px]">
			{/* Hero */}
			<div className="relative bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-primary/12 rounded-2xl p-8 mb-6 overflow-hidden">
				<div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
				<p className="text-xs tracking-[3px] uppercase text-yellow-400 mb-2 font-heading">
					Black Hornets Racing
				</p>
				<h1 className="font-heading text-2xl text-white mb-1">
					Welcome back, <span className="text-primary">{name}</span>
				</h1>
				<p className="text-text-gray text-sm">Admin Dashboard</p>
			</div>

			{/* Stat cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				{STAT_CARDS.map(({ key, label, icon, href, sub }) => (
					<StatCard
						key={key}
						href={href}
						icon={icon}
						label={label}
						value={stats?.[key] ?? "—"}
					>
						<span>{sub}</span>
					</StatCard>
				))}

				<StatCard
					href="/admin/members"
					icon="fas fa-users"
					label="Team Members"
					value={stats?.team_members.total ?? "—"}
				>
					<div className="flex flex-col gap-0.5">
						{TEAM_BREAKDOWN.map(({ key, label }) => (
							<span key={key}>
								{label}: {stats?.team_members[key] ?? 0}
							</span>
						))}
					</div>
				</StatCard>
			</div>

			{/* Quick actions */}
			<div className="mb-4 flex items-center gap-3">
				<span className="font-heading text-xs tracking-[2px] uppercase text-primary">
					Quick Actions
				</span>
				<div className="flex-1 h-px bg-primary/12" />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
				{QUICK_ACTIONS.map(({ href, icon, label, desc }) => (
					<QuickActionCard
						key={href}
						href={href}
						icon={icon}
						label={label}
						desc={desc}
					/>
				))}
			</div>
		</div>
	);
}
