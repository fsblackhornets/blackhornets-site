import Link from "next/link";
import { Check, FileEdit, Heart, Image as ImageIcon, Inbox, Settings, Users, type LucideIcon } from "lucide-react";
import { auth } from "@/auth";
import { REQUEST_STATUS_BADGE, REQUEST_STATUS_BORDER, REQUEST_STATUSES, REQUEST_TYPES } from "@/constants/admin";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchRequests } from "@/lib/api/requests";

export const metadata = buildAdminMeta("Requests");

function getTitle(data: Record<string, unknown>): string {
	return String(data.name ?? data.title_sr ?? data.full_name ?? "—");
}

const TYPE_ICONS: Record<string, LucideIcon> = {
	post: FileEdit,
	project: Settings,
	sponsor: Heart,
	member: Users,
	gallery: ImageIcon,
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

	const STATUSES = REQUEST_STATUSES;
	const TYPES = REQUEST_TYPES;

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
					<Inbox size={32} strokeWidth={1.5} stroke="rgba(255,215,0,0.25)" className="mx-auto mb-3" aria-hidden="true" />
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
								className={`bg-[#111] border border-[#1e1e1e] border-l-[3px] rounded-sm px-5 py-4 flex items-start justify-between gap-4 transition-colors hover:border-[#2a2a2a] ${REQUEST_STATUS_BORDER[r.status] ?? "border-l-[#333]"} ${r.status === "approved" ? "opacity-60" : ""}`}
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="w-[34px] h-[34px] rounded-sm bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
										{(() => { const Icon = TYPE_ICONS[r.type]; return Icon ? <Icon size={14} strokeWidth={1.5} stroke="rgba(255,215,0,0.6)" aria-hidden="true" /> : null; })()}
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
												<Check size={9} strokeWidth={2} stroke="#4ade80" aria-hidden="true" />
												<span className="font-body text-[8px] text-green-500/60">
													Published to site
												</span>
											</p>
										)}
									</div>
								</div>
								<span
									className={`font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1.5 shrink-0 ${REQUEST_STATUS_BADGE[r.status] ?? ""}`}
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
