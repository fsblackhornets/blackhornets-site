import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/constants/site";
import { fetchProject } from "@/lib/api/projects";
import {
	buildProjectImageUrl,
	formatDate,
	getProgressColor,
	getProjectStatusVariant,
} from "@/lib/utils/utils";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const project = await fetchProject(Number(id));
	if (!project) return { title: `Project — ${SITE_NAME}` };

	return {
		title: `${project.name} — ${SITE_NAME}`,
		description: project.description ?? undefined,
	};
}

function badgeStyle(variant: string) {
	if (variant === "success")
		return {
			background: "rgba(34,197,94,0.10)",
			color: "#4ade80",
			border: "1px solid rgba(34,197,94,0.20)",
		};
	if (variant === "info")
		return {
			background: "rgba(96,165,250,0.10)",
			color: "#60a5fa",
			border: "1px solid rgba(96,165,250,0.20)",
		};
	return {
		background: "rgba(255,215,0,0.12)",
		color: "#ffd700",
		border: "1px solid rgba(255,215,0,0.25)",
	};
}

export default async function ProjectDetailPage({ params }: Props) {
	const { id } = await params;
	const project = await fetchProject(Number(id));
	if (!project) notFound();

	const imageUrl = project.image_url
		? buildProjectImageUrl(project.image_url)
		: null;
	const progressColor = getProgressColor(project.progress);
	const statusVariant = getProjectStatusVariant(project.status);

	return (
		<div className="max-w-screen-2xl mx-auto px-4 py-16">
			{/* Back link */}
			<Link
				href="/projects"
				className="inline-flex items-center gap-2 font-heading text-[8px] tracking-[3px] uppercase text-primary mb-8"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#ffd700"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>
				Back to Projects
			</Link>

			{/* Hero image */}
			{imageUrl && (
				<div className="relative h-80 rounded-none overflow-hidden mb-8 border border-[#222]">
					<Image
						src={imageUrl}
						alt={project.name}
						fill
						className="object-cover"
						priority
					/>
					<div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary to-primary/10" />
				</div>
			)}

			{/* Title + status */}
			<div className="flex items-start justify-between gap-4 mb-4">
				<div>
					<p className="font-heading text-[9px] tracking-[5px] uppercase text-primary mb-2">
						Project
					</p>
					<h1 className="font-heading text-[clamp(1.6rem,4vw,2.4rem)] text-white uppercase tracking-[2px]">
						{project.name}
					</h1>
				</div>
				<span
					style={{
						...badgeStyle(statusVariant),
						clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)",
					}}
					className="font-heading text-[7px] tracking-[2px] uppercase px-3 py-1.5 shrink-0 mt-1"
				>
					{project.status}
				</span>
			</div>

			{/* Description */}
			{project.description && (
				<p className="font-body text-[10.5px] leading-[1.9] text-[#888] max-w-3xl mb-10">
					{project.description}
				</p>
			)}

			{/* Meta cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				{project.due_date && (
					<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 bg-bg-panel p-4 flex items-center gap-3">
						<div className="w-8 h-8 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0">
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="rgba(255,215,0,.5)"
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
								<line x1="16" y1="2" x2="16" y2="6" />
								<line x1="8" y1="2" x2="8" y2="6" />
								<line x1="3" y1="10" x2="21" y2="10" />
							</svg>
						</div>
						<div>
							<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#555] mb-1">
								Due Date
							</p>
							<p className="font-body text-[10px] text-[#e0e0e0]">
								{formatDate(project.due_date)}
							</p>
						</div>
					</div>
				)}
				{project.duration && (
					<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 bg-bg-panel p-4 flex items-center gap-3">
						<div className="w-8 h-8 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0">
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="rgba(255,215,0,.5)"
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 16 14" />
							</svg>
						</div>
						<div>
							<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#555] mb-1">
								Duration
							</p>
							<p className="font-body text-[10px] text-[#e0e0e0]">
								{project.duration}
							</p>
						</div>
					</div>
				)}
				<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 bg-bg-panel p-4 flex items-center gap-3">
					<div className="w-8 h-8 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="rgba(255,215,0,.5)"
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M5 22h14" />
							<path d="M5 2h14" />
							<path d="M17 22v-4.172a2 2 0 00-.586-1.414L12 12l-4.414 4.414A2 2 0 007 17.828V22" />
							<path d="M7 2v4.172a2 2 0 00.586 1.414L12 12l4.414-4.414A2 2 0 0017 6.172V2" />
						</svg>
					</div>
					<div>
						<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#555] mb-1">
							Timeline
						</p>
						<p
							className={`font-body text-[10px] ${project.is_overdue ? "text-red-400" : "text-[#e0e0e0]"}`}
						>
							{project.is_overdue
								? `${project.days_remaining} days overdue`
								: `${project.days_remaining} days remaining`}
						</p>
					</div>
				</div>
			</div>

			{/* Progress */}
			<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary bg-bg-panel p-6">
				<div className="flex justify-between items-center mb-3">
					<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary">
						Progress
					</span>
					<span className="font-heading text-[22px] text-primary font-black">
						{project.progress}%
					</span>
				</div>
				<div className="h-[5px] bg-[#1e1e1e] rounded-none overflow-hidden">
					<div
						className="h-full rounded-none transition-all duration-700"
						style={{
							width: `${project.progress}%`,
							background:
								statusVariant === "in-progress"
									? "linear-gradient(90deg, #ffd700, #ffc107)"
									: progressColor,
						}}
					/>
				</div>
				<p className="text-right font-heading text-[7px] tracking-[2px] uppercase text-[#444] mt-1">
					{project.progress}% complete
				</p>
			</div>
		</div>
	);
}
