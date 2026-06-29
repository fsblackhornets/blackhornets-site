"use client";

import {
	FileEdit,
	Heart,
	Image as ImageIcon,
	Inbox,
	Info,
	type LucideIcon,
	Settings,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { ContentRequest, RequestStatus } from "@/types/request";

const STATUS_BORDER: Record<RequestStatus, string> = {
	pending: "border-l-primary",
	approved: "border-l-green-500",
	declined: "border-l-red-600",
};

const STATUS_BADGE: Record<RequestStatus, string> = {
	pending: "bg-primary/10 text-primary",
	approved: "bg-green-500/10 text-green-400",
	declined: "bg-red-500/10 text-red-400",
};

const TYPE_ICONS: Record<string, LucideIcon> = {
	post: FileEdit,
	project: Settings,
	sponsor: Heart,
	member: Users,
	gallery: ImageIcon,
};

function getTitle(data: Record<string, unknown>): string {
	return String(data.name ?? data.title_sr ?? data.full_name ?? "—");
}

const FILTERS = ["All", "Pending", "Approved", "Declined"] as const;
type Filter = (typeof FILTERS)[number];

export function RequestsFilterClient({
	requests,
}: {
	requests: ContentRequest[];
}) {
	const [filter, setFilter] = useState<Filter>("All");

	const filtered =
		filter === "All"
			? requests
			: requests.filter((r) => r.status === filter.toLowerCase());

	return (
		<>
			{/* Filter chips */}
			<div className="flex gap-2 flex-wrap mb-6">
				{FILTERS.map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFilter(f)}
						className="font-heading text-[7.5px] tracking-[2px] uppercase px-3 py-1.5 transition-colors"
						style={{
							clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
							border: filter === f ? "1px solid #ffd700" : "1px solid #222",
							background: filter === f ? "rgba(255,215,0,0.1)" : "transparent",
							color: filter === f ? "#ffd700" : "#555",
						}}
					>
						{f}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<Inbox
						size={32}
						strokeWidth={1.5}
						stroke="rgba(255,215,0,0.25)"
						className="mx-auto mb-3"
						aria-hidden="true"
					/>
					<p className="font-heading text-[9px] tracking-[3px] uppercase text-[#333]">
						No requests yet
					</p>
					<Link
						href="/manager"
						className="mt-4 inline-block font-heading text-[8px] tracking-[2px] uppercase text-primary hover:underline"
					>
						Submit your first request
					</Link>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{filtered.map((r) => (
						<div
							key={r.id}
							className={`bg-[#111] border border-[#1e1e1e] border-l-[3px] rounded-sm px-5 py-4 ${STATUS_BORDER[r.status]}`}
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-center gap-3 min-w-0">
									{(() => {
										const Icon = TYPE_ICONS[r.type];
										return Icon ? (
											<Icon
												size={14}
												strokeWidth={1.5}
												stroke="rgba(255,215,0,0.4)"
												style={{ flexShrink: 0 }}
												aria-hidden="true"
											/>
										) : null;
									})()}
									<div className="min-w-0">
										<p className="font-body text-[10px] font-semibold text-[#e0e0e0] truncate">
											{getTitle(r.data)}
										</p>
										<p className="font-heading text-[7px] tracking-[2px] uppercase text-[#666] mt-0.5">
											{r.type}
											{" · "}
											{new Date(r.created_at).toLocaleDateString()}
										</p>
									</div>
								</div>
								<span
									className={`font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1.5 shrink-0 ${STATUS_BADGE[r.status]}`}
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
									}}
								>
									{r.status}
								</span>
							</div>

							{r.admin_notes && (
								<div className="border-t border-[#1a1a1a] pt-2.5 mt-2.5 flex items-start gap-1.5">
									<Info
										size={11}
										strokeWidth={1.5}
										stroke="rgba(255,215,0,0.3)"
										style={{ flexShrink: 0, marginTop: "1px" }}
										aria-hidden="true"
									/>
									<p className="text-[8.5px] text-[#444] leading-snug">
										<span className="text-primary/40 font-semibold">
											Admin note:{" "}
										</span>
										{r.admin_notes}
									</p>
								</div>
							)}

							{r.status === "declined" && (
								<div className="mt-3 pt-2.5 border-t border-[#1a1a1a]">
									<Link
										href={`/manager/requests/${r.id}/resubmit`}
										className="inline-flex items-center gap-1.5 font-heading text-[7.5px] tracking-[2px] uppercase text-primary border border-primary/30 px-3 py-1.5 transition-colors hover:bg-primary/10"
										style={{
											clipPath:
												"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
										}}
									>
										<FileEdit size={10} strokeWidth={2} aria-hidden="true" />
										Edit & Resubmit
									</Link>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</>
	);
}
