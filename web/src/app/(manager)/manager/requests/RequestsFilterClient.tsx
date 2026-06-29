"use client";

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
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="rgba(255,215,0,0.4)"
										strokeWidth={1.5}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										style={{ flexShrink: 0 }}
									>
										{TYPE_ICON_PATHS[r.type] ?? null}
									</svg>
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
									<svg
										width="11"
										height="11"
										viewBox="0 0 24 24"
										fill="none"
										stroke="rgba(255,215,0,0.3)"
										strokeWidth={1.5}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
										style={{ flexShrink: 0, marginTop: "1px" }}
									>
										<circle cx="12" cy="12" r="10" />
										<line x1="12" y1="8" x2="12" y2="12" />
										<line x1="12" y1="16" x2="12.01" y2="16" />
									</svg>
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
										<svg
											width="10"
											height="10"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											aria-hidden="true"
										>
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
										</svg>
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
