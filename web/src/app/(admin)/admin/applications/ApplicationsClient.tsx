"use client";

import { Briefcase, Calendar, FileText, GraduationCap, Home } from "lucide-react";
import { StatusBadge } from "@/components/ui/components/Badge";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/components/Dialog";
import { buildApplicationsUrl } from "@/helpers/buildApplicationsUrl";
import { useApplicationReview } from "@/hooks/admin/useApplicationReview";
import type { ApplicationsResponse } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils/utils";
import { APPLICATION_TABS } from "@/constants/admin";

interface Props {
	res: ApplicationsResponse | null;
	currentStatus: string;
	currentPage: number;
}

export function ApplicationsClient({ res, currentStatus, currentPage }: Props) {
	const { selected, setSelected, loading, handleReview } =
		useApplicationReview();

	const handleTabChange = (value: string) => {
		window.location.href = buildApplicationsUrl(value);
	};

	return (
		<>
			{/* Filter chips */}
			<div className="flex flex-wrap gap-2 mb-6">
				{APPLICATION_TABS.map(({ value, label }) => {
					const isActive = currentStatus === value;
					return (
						<button
							key={value}
							type="button"
							onClick={() => handleTabChange(value)}
							className={`font-heading text-[7px] tracking-[2px] uppercase px-4 py-2 border transition-colors ${
								isActive
									? "bg-primary/10 border-primary text-primary"
									: "border-[#1e1e1e] text-[#555] hover:border-primary/40 hover:text-[#888]"
							}`}
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
							}}
						>
							{label}
						</button>
					);
				})}
			</div>

			{!res || res.data.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<FileText size={36} strokeWidth={1.5} stroke="rgba(255,215,0,.2)" className="mx-auto mb-4" aria-hidden="true" />
					<p className="font-heading text-[9px] tracking-[3px] uppercase text-[#333]">
						No applications found.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{res.data.map((app) => (
						<button
							key={app.id}
							type="button"
							onClick={() => setSelected(app)}
							className="bg-[#111] border border-[#1e1e1e] rounded-sm p-5 text-left hover:border-primary/30 transition-colors border-l-[2px] border-l-primary/20 hover:border-l-primary/60"
						>
							<div className="flex items-start justify-between gap-3 mb-3">
								<div>
									<p className="font-body font-semibold text-[10px] text-[#e0e0e0]">
										{app.first_name} {app.last_name}
									</p>
									<p className="font-body text-[8px] text-[#444]">
										{app.email}
									</p>
								</div>
								<StatusBadge status={app.status} />
							</div>
							<div className="grid grid-cols-2 gap-2 font-body text-[8px] text-[#444]">
								<span className="flex items-center gap-1.5">
									<Briefcase size={10} strokeWidth={1.5} stroke="rgba(255,215,0,.4)" aria-hidden="true" />
									{app.desired_position}
								</span>
								<span className="flex items-center gap-1.5">
									<GraduationCap size={10} strokeWidth={1.5} stroke="rgba(255,215,0,.4)" aria-hidden="true" />
									GPA {app.gpa}
								</span>
								<span className="flex items-center gap-1.5">
									<Home size={10} strokeWidth={1.5} stroke="rgba(255,215,0,.4)" aria-hidden="true" />
									{app.faculty}
								</span>
								<span className="flex items-center gap-1.5">
									<Calendar size={10} strokeWidth={1.5} stroke="rgba(255,215,0,.4)" aria-hidden="true" />
									{formatDate(app.created_at)}
								</span>
							</div>
						</button>
					))}
				</div>
			)}

			{/* Pagination */}
			{res && res.total_pages > 1 && (
				<div className="flex justify-center gap-2 mt-6">
					{Array.from({ length: res.total_pages }, (_, i) => i + 1).map((p) => (
						<a
							key={p}
							href={buildApplicationsUrl(currentStatus, p)}
							className={`w-9 h-9 rounded-sm font-heading text-[8px] flex items-center justify-center transition-colors ${
								p === currentPage
									? "bg-primary text-black"
									: "border border-[#1e1e1e] text-[#444] hover:border-primary hover:text-primary"
							}`}
						>
							{p}
						</a>
					))}
				</div>
			)}

			{/* Detail Dialog */}
			<Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
				{selected && (
					<DialogContent className="max-w-xl">
						<DialogHeader>
							<DialogTitle>
								{selected.first_name} {selected.last_name}
							</DialogTitle>
							<div className="flex gap-2 mt-2">
								<StatusBadge status={selected.status} />
								<span
									className="inline-block font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									}}
								>
									{selected.desired_position}
								</span>
							</div>
						</DialogHeader>

						<div className="grid grid-cols-2 gap-3 mb-4">
							{[
								{ label: "Email", value: selected.email },
								{ label: "Phone", value: selected.phone },
								{ label: "Student ID", value: selected.student_id },
								{ label: "Faculty", value: selected.faculty },
								{ label: "Major", value: selected.major },
								{ label: "GPA", value: String(selected.gpa) },
								{
									label: "Academic Year",
									value: String(selected.academic_year),
								},
								{ label: "Applied", value: formatDate(selected.created_at) },
							].map(({ label, value }) => (
								<div key={label}>
									<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-0.5">
										{label}
									</p>
									<p className="font-body text-[10px] text-[#ccc]">{value}</p>
								</div>
							))}
						</div>

						{selected.motivation && (
							<div className="mb-4">
								<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-1">
									Motivation
								</p>
								<p className="font-body text-[9.5px] text-[#aaa] leading-relaxed bg-[#0e0e0e] border border-[#1e1e1e] rounded-sm p-3 max-h-36 overflow-y-auto">
									{selected.motivation}
								</p>
							</div>
						)}

						{selected.resume_path && (
							<a
								href={`${process.env.NEXT_PUBLIC_API_BASE?.replace("/backend/api", "")}/frontend/${selected.resume_path}`}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 text-primary text-[9px] hover:underline mb-2"
							>
								<FileText size={11} strokeWidth={2} aria-hidden="true" />
								View Resume
							</a>
						)}

						<DialogFooter>
							{selected.status !== "reviewing" && (
								<button
									type="button"
									onClick={() => handleReview("review")}
									disabled={!!loading}
									className="border border-primary/30 text-primary font-heading text-[7.5px] tracking-[2px] uppercase py-2 px-4 hover:bg-primary/10 disabled:opacity-50 transition-colors"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
									}}
								>
									{loading === "review" ? "…" : "Mark Reviewing"}
								</button>
							)}
							{selected.status !== "rejected" && (
								<button
									type="button"
									onClick={() => handleReview("reject")}
									disabled={!!loading}
									className="border border-red-500/30 text-red-400 font-heading text-[7.5px] tracking-[2px] uppercase py-2 px-4 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
									}}
								>
									{loading === "reject" ? "…" : "Reject"}
								</button>
							)}
							{selected.status !== "accepted" && (
								<button
									type="button"
									onClick={() => handleReview("accept")}
									disabled={!!loading}
									className="bg-green-600/20 border border-green-500/30 text-green-400 font-heading text-[7.5px] tracking-[2px] uppercase py-2 px-4 hover:bg-green-600/30 disabled:opacity-50 transition-colors"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
									}}
								>
									{loading === "accept" ? "…" : "Accept"}
								</button>
							)}
						</DialogFooter>
					</DialogContent>
				)}
			</Dialog>
		</>
	);
}
