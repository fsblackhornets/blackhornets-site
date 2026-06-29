import { Calendar, ChevronLeft, Clock, Hourglass } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
	const [project, t] = await Promise.all([
		fetchProject(Number(id)),
		getTranslations("projects"),
	]);
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
				<ChevronLeft
					size={14}
					strokeWidth={2}
					stroke="#ffd700"
					aria-hidden="true"
				/>
				{t("backToProjects")}
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
						{t("project")}
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
							<Calendar
								size={14}
								strokeWidth={1.5}
								stroke="rgba(255,215,0,.5)"
								aria-hidden="true"
							/>
						</div>
						<div>
							<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#555] mb-1">
								{t("dueDate")}
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
							<Clock
								size={14}
								strokeWidth={1.5}
								stroke="rgba(255,215,0,.5)"
								aria-hidden="true"
							/>
						</div>
						<div>
							<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#555] mb-1">
								{t("duration")}
							</p>
							<p className="font-body text-[10px] text-[#e0e0e0]">
								{project.duration}
							</p>
						</div>
					</div>
				)}
				<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 bg-bg-panel p-4 flex items-center gap-3">
					<div className="w-8 h-8 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0">
						<Hourglass
							size={14}
							strokeWidth={1.5}
							stroke="rgba(255,215,0,.5)"
							aria-hidden="true"
						/>
					</div>
					<div>
						<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#555] mb-1">
							{t("timeline")}
						</p>
						<p
							className={`font-body text-[10px] ${project.is_overdue ? "text-red-400" : "text-[#e0e0e0]"}`}
						>
							{project.is_overdue
								? t("daysOverdue", { count: project.days_remaining })
								: t("daysRemaining", { count: project.days_remaining })}
						</p>
					</div>
				</div>
			</div>

			{/* Progress */}
			<div className="rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary bg-bg-panel p-6">
				<div className="flex justify-between items-center mb-3">
					<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary">
						{t("progress")}
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
							background: progressColor,
						}}
					/>
				</div>
				<p className="text-right font-heading text-[7px] tracking-[2px] uppercase text-[#444] mt-1">
					{t("percentComplete", { percent: project.progress })}
				</p>
			</div>
		</div>
	);
}
