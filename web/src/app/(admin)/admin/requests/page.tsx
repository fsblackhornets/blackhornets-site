import Link from "next/link";
import { auth } from "@/auth";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchRequests } from "@/lib/api/requests";
import type { RequestType } from "@/types/request";

export const metadata = buildAdminMeta("Requests");

function getTitle(data: Record<string, unknown>): string {
	return String(data.name ?? data.title_sr ?? data.full_name ?? "—");
}

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

const TYPE_ICON_PATHS: Record<string, React.ReactNode> = {
	post: (
		<>
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
		</>
	),
	project: (
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</>
	),
	sponsor: (
		<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
	),
	member: (
		<>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</>
	),
	gallery: (
		<>
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
			<circle cx="8.5" cy="8.5" r="1.5" />
			<polyline points="21 15 16 10 5 21" />
		</>
	),
};

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

	const STATUSES = ["", "pending", "approved", "declined"] as const;
	const TYPES = [
		"",
		"post",
		"project",
		"sponsor",
		"member",
		"gallery",
	] as const;

	function chipStyle(active: boolean) {
		return {
			clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
			border: active ? "1px solid #ffd700" : "1px solid #1e1e1e",
			background: active ? "rgba(255,215,0,0.08)" : "transparent",
			color: active ? "#ffd700" : "#444",
		};
	}

	return (
		<div className="max-w-[900px]">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
						Content Requests
					</h1>
					{pending.length > 0 && (
						<div className="inline-flex items-center gap-1 mt-1 bg-primary/8 border border-primary/20 rounded-sm px-2 py-0.5">
							<span className="font-heading text-[7px] tracking-[2px] uppercase text-primary">
								{pending.length} pending
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-2 mb-6">
				{STATUSES.map((s) => (
					<Link
						key={s || "all-status"}
						href={`/admin/requests${s ? `?status=${s}` : ""}`}
						className="font-heading text-[7.5px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
						style={chipStyle((status ?? "") === s)}
					>
						{s || "All"}
					</Link>
				))}
				<div className="w-px h-5 bg-[#1e1e1e] mx-1" />
				{TYPES.map((t) => (
					<Link
						key={t || "all-type"}
						href={`/admin/requests${t ? `?type=${t}` : ""}`}
						className="font-heading text-[7.5px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
						style={chipStyle((type ?? "") === t)}
					>
						{t || "All types"}
					</Link>
				))}
			</div>

			{sorted.length === 0 ? (
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
						No requests found
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{sorted.map((r) => {
						const galleryItems = Array.isArray(r.data.gallery_items)
							? (r.data.gallery_items as unknown[]).filter((item) => {
									const i = item as Record<string, unknown>;
									return i.galleryCategory && i.galleryCategory !== "none";
								})
							: [];

						return (
							<Link
								key={r.id}
								href={`/admin/requests/${r.id}`}
								className={`bg-[#111] border border-[#1e1e1e] border-l-[3px] rounded-sm px-5 py-4 flex items-start justify-between gap-4 transition-colors hover:border-[#2a2a2a] ${STATUS_BORDER[r.status] ?? "border-l-[#333]"} ${r.status === "approved" ? "opacity-60" : ""}`}
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-[34px] h-[34px] rounded-sm bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="rgba(255,215,0,0.6)"
											strokeWidth={1.5}
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											{TYPE_ICON_PATHS[r.type as RequestType] ?? null}
										</svg>
									</div>
									<div className="min-w-0">
										<p className="font-body text-[10px] font-semibold text-[#e0e0e0] truncate">
											{getTitle(r.data)}
										</p>
										<p className="font-heading text-[7px] tracking-[2px] uppercase text-[#555] mt-0.5">
											{r.type} · {r.submitter_name} ·{" "}
											{new Date(r.created_at).toLocaleDateString()}
										</p>
										{galleryItems.length > 0 && (
											<span
												className="inline-block mt-1 font-heading text-[6.5px] tracking-[1.5px] uppercase bg-primary/6 border border-primary/15 text-primary/70 px-1.5 py-0.5"
												style={{
													clipPath:
														"polygon(0 0, calc(100% - 3px) 0, 100% 100%, 3px 100%)",
												}}
											>
												{galleryItems.length} image
												{galleryItems.length !== 1 ? "s" : ""} → Gallery
											</span>
										)}
										{r.status === "approved" && (
											<p className="flex items-center gap-1 mt-0.5">
												<svg
													width="9"
													height="9"
													viewBox="0 0 24 24"
													fill="none"
													stroke="#4ade80"
													strokeWidth={2}
													aria-hidden="true"
												>
													<polyline points="20 6 9 17 4 12" />
												</svg>
												<span className="font-body text-[8px] text-green-500/60">
													Published to site
												</span>
											</p>
										)}
									</div>
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
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
