import Link from "next/link";
import { auth } from "@/auth";
import { REQUEST_STATUS_COLORS, REQUEST_TYPE_ICONS } from "@/constants/requests";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchRequests } from "@/lib/api/requests";

export const metadata = buildAdminMeta("Requests");

function getTitle(data: Record<string, unknown>): string {
	return String(data.name ?? data.title_sr ?? data.full_name ?? "—");
}

interface Props {
	searchParams: Promise<{ status?: string; type?: string }>;
}

export default async function AdminRequestsPage({ searchParams }: Props) {
	const { status, type } = await searchParams;
	const session = await auth();

	const requests = await fetchRequests({
		role: session?.user?.role ?? "admin",
		status: status ?? undefined,
		type: type ?? undefined,
	});

	const pending = requests.filter((r) => r.status === "pending");
	const others = requests.filter((r) => r.status !== "pending");
	const sorted = [...pending, ...others];

	return (
		<div className="max-w-[900px]">
			<h1 className="font-heading text-xl text-primary tracking-widest uppercase mb-6">
				Content Requests
			</h1>

			{/* Filters */}
			<div className="flex flex-wrap gap-2 mb-6">
				{(["", "pending", "approved", "declined"] as const).map((s) => (
					<Link
						key={s || "all"}
						href={`/admin/requests${s ? `?status=${s}` : ""}`}
						className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
							(status ?? "") === s
								? "bg-primary/10 text-primary border-primary/30"
								: "text-text-gray border-primary/10 hover:border-primary/20"
						}`}
					>
						{s || "All"}
					</Link>
				))}
				<span className="text-primary/20 self-center">|</span>
				{(["", "post", "project", "sponsor", "member"] as const).map((t) => (
					<Link
						key={t || "all-type"}
						href={`/admin/requests${t ? `?type=${t}` : ""}`}
						className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
							(type ?? "") === t
								? "bg-primary/10 text-primary border-primary/30"
								: "text-text-gray border-primary/10 hover:border-primary/20"
						}`}
					>
						{t || "All types"}
					</Link>
				))}
			</div>

			{sorted.length === 0 ? (
				<div className="text-center py-16 border border-primary/10 rounded-xl">
					<i className="fas fa-inbox text-3xl text-text-gray/30 mb-3 block" />
					<p className="text-text-gray text-sm">No requests found.</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{sorted.map((r) => (
						<Link
							key={r.id}
							href={`/admin/requests/${r.id}`}
							className="bg-[#111] border border-primary/10 hover:border-primary/30 rounded-xl px-5 py-4 flex items-center justify-between gap-4 transition-colors group"
						>
							<div className="flex items-center gap-3 min-w-0">
								<i
									className={`${REQUEST_TYPE_ICONS[r.type]} text-primary/50 shrink-0 group-hover:text-primary transition-colors`}
									aria-hidden="true"
								/>
								<div className="min-w-0">
									<p className="text-text-light text-sm font-semibold truncate">
										{getTitle(r.data)}
									</p>
									<p className="text-text-gray text-xs mt-0.5">
										<span className="uppercase tracking-widest font-heading">
											{r.type}
										</span>
										{" · "}
										{r.submitter_name}
										{" · "}
										{new Date(r.created_at).toLocaleDateString()}
									</p>
								</div>
							</div>
							<span
								className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${REQUEST_STATUS_COLORS[r.status]}`}
							>
								{r.status}
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
