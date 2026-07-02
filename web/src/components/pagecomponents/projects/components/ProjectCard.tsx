import { Calendar, Clock, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	buildProjectImageUrl,
	formatDate,
	getProjectStatusVariant,
} from "@/lib/utils/utils";
import type { Project } from "@/types/project";

function statusStyle(variant: string): React.CSSProperties {
	if (variant === "success")
		return { background: "rgba(34,197,94,0.12)", color: "#4ade80" };
	if (variant === "warning")
		return { background: "rgba(255,215,0,0.10)", color: "#ffd700" };
	return { background: "rgba(96,165,250,0.12)", color: "#60a5fa" };
}

export function ProjectCard({ project }: { project: Project }) {
	const imageUrl = project.image_url
		? buildProjectImageUrl(project.image_url)
		: null;
	const statusVariant = getProjectStatusVariant(project.status);
	const progressColor =
		project.progress === 100
			? "#4ade80"
			: project.progress === 0
				? "#333"
				: "#ffd700";

	return (
		<Link
			href={`/projects/${project.id}`}
			className="group bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 overflow-hidden flex flex-col hover:border-primary/60 transition-all duration-200"
		>
			{/* Image */}
			<div className="relative h-48 bg-bg-dark overflow-hidden">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={project.name}
						fill
						className="object-contain transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-primary/30 font-heading text-5xl font-bold">
						{project.name.charAt(0)}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-5 flex flex-col flex-1 gap-3">
				<h3 className="font-heading text-primary text-lg tracking-wide">
					{project.name}
				</h3>

				{/* Status badge below title */}
				<span
					className="self-start font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1"
					style={{
						clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
						...statusStyle(statusVariant),
					}}
				>
					{project.status}
				</span>

				{project.description && (
					<p className="text-text-gray text-sm leading-relaxed flex-1 line-clamp-2 font-body">
						{project.description}
					</p>
				)}

				<div className="flex gap-4 text-xs text-text-gray flex-wrap font-body">
					{project.due_date && (
						<span className="flex items-center gap-1.5">
							<Calendar className="w-3 h-3 text-primary" />
							{formatDate(project.due_date)}
						</span>
					)}
					{project.duration && (
						<span className="flex items-center gap-1.5">
							<Clock className="w-3 h-3 text-primary" />
							{project.duration}
						</span>
					)}
					<span
						className={`flex items-center gap-1.5 ${project.is_overdue ? "text-red-400" : ""}`}
					>
						<Timer
							className={`w-3 h-3 ${project.is_overdue ? "text-red-400" : "text-primary"}`}
						/>
						{project.is_overdue
							? `${project.days_remaining} days overdue`
							: `${project.days_remaining} days remaining`}
					</span>
				</div>

				{/* Progress % label */}
				<span
					className="font-heading text-[9px]"
					style={{ color: progressColor }}
				>
					{project.progress}%
				</span>
			</div>

			{/* Progress bar — full width, bottom of card */}
			<div className="h-[3px] w-full bg-bg-dark">
				<div
					className="h-full transition-all duration-500"
					style={{
						width: `${project.progress}%`,
						backgroundColor: progressColor,
					}}
				/>
			</div>
		</Link>
	);
}
