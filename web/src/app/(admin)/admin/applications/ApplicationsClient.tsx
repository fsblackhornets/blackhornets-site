"use client";

import { Badge, StatusBadge } from "@/components/ui/components/Badge";
import { Button } from "@/components/ui/components/Button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/components/Dialog";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/components/Tabs";
import { buildApplicationsUrl } from "@/helpers/buildApplicationsUrl";
import { useApplicationReview } from "@/hooks/admin/useApplicationReview";
import type { ApplicationsResponse } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils/utils";
import { APPLICATION_TABS } from "./constants";

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
			<Tabs value={currentStatus} onValueChange={handleTabChange}>
				<TabsList className="mb-6">
					{APPLICATION_TABS.map(({ value, label }) => (
						<TabsTrigger key={value} value={value}>
							{label}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value={currentStatus}>
					{!res || res.data.length === 0 ? (
						<div className="bg-[#111] border border-primary/12 rounded-2xl p-16 text-center text-text-gray">
							<i
								className="fas fa-file-alt text-4xl text-primary/30 mb-4 block"
								aria-hidden="true"
							/>
							No applications found.
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{res.data.map((app) => (
								<button
									key={app.id}
									type="button"
									onClick={() => setSelected(app)}
									className="bg-[#111] border border-primary/12 rounded-xl p-5 text-left hover:border-primary/40 transition-colors"
								>
									<div className="flex items-start justify-between gap-3 mb-3">
										<div>
											<p className="text-text-light font-semibold text-sm">
												{app.first_name} {app.last_name}
											</p>
											<p className="text-text-gray text-xs">{app.email}</p>
										</div>
										<StatusBadge status={app.status} />
									</div>
									<div className="grid grid-cols-2 gap-2 text-xs text-text-gray">
										<span>
											<i className="fas fa-briefcase text-primary/60 mr-1" />
											{app.desired_position}
										</span>
										<span>
											<i className="fas fa-graduation-cap text-primary/60 mr-1" />
											GPA {app.gpa}
										</span>
										<span>
											<i className="fas fa-university text-primary/60 mr-1" />
											{app.faculty}
										</span>
										<span>
											<i className="fas fa-calendar text-primary/60 mr-1" />
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
							{Array.from({ length: res.total_pages }, (_, i) => i + 1).map(
								(p) => (
									<a
										key={p}
										href={buildApplicationsUrl(currentStatus, p)}
										className={`w-9 h-9 rounded-lg font-heading text-sm flex items-center justify-center transition-colors ${
											p === currentPage
												? "bg-primary text-bg-dark"
												: "border border-gray-mid text-text-gray hover:border-primary hover:text-primary"
										}`}
									>
										{p}
									</a>
								),
							)}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Detail Dialog */}
			<Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
				{selected && (
					<DialogContent className="max-w-xl">
						<DialogHeader>
							<DialogTitle>
								{selected.first_name} {selected.last_name}
							</DialogTitle>
							<div className="flex gap-2 mt-1">
								<StatusBadge status={selected.status} />
								<Badge variant="info">{selected.desired_position}</Badge>
							</div>
						</DialogHeader>

						<div className="grid grid-cols-2 gap-3 text-sm mb-4">
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
									<p className="text-text-gray text-xs uppercase tracking-widest mb-0.5">
										{label}
									</p>
									<p className="text-text-light">{value}</p>
								</div>
							))}
						</div>

						{selected.motivation && (
							<div className="mb-4">
								<p className="text-text-gray text-xs uppercase tracking-widest mb-1">
									Motivation
								</p>
								<p className="text-text-light text-sm leading-relaxed bg-bg-dark rounded-xl p-3 max-h-36 overflow-y-auto">
									{selected.motivation}
								</p>
							</div>
						)}

						{selected.resume_path && (
							<a
								href={`${process.env.NEXT_PUBLIC_API_BASE?.replace("/backend/api", "")}/frontend/${selected.resume_path}`}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 text-primary text-sm hover:underline mb-2"
							>
								<i className="fas fa-file-pdf" aria-hidden="true" />
								View Resume
							</a>
						)}

						<DialogFooter>
							{selected.status !== "reviewing" && (
								<Button
									variant="secondary"
									onClick={() => handleReview("review")}
									disabled={!!loading}
								>
									{loading === "review" ? "…" : "Mark Reviewing"}
								</Button>
							)}
							{selected.status !== "rejected" && (
								<Button
									variant="danger"
									onClick={() => handleReview("reject")}
									disabled={!!loading}
								>
									{loading === "reject" ? "…" : "Reject"}
								</Button>
							)}
							{selected.status !== "accepted" && (
								<Button
									variant="primary"
									onClick={() => handleReview("accept")}
									disabled={!!loading}
								>
									{loading === "accept" ? "…" : "Accept"}
								</Button>
							)}
						</DialogFooter>
					</DialogContent>
				)}
			</Dialog>
		</>
	);
}
