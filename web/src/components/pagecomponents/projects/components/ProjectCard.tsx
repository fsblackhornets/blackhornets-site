import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Timer } from "lucide-react";
import { Badge } from "@/components/ui/components/Badge";
import {
	buildProjectImageUrl,
	formatDate,
	getProgressColor,
	getProjectStatusVariant,
} from "@/lib/utils/utils";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
	const imageUrl = project.image_url
		? buildProjectImageUrl(project.image_url)
		: null;
	const progressColor = getProgressColor(project.progress);
	const statusVariant = getProjectStatusVariant(project.status);

	return (
		<Link
			href={`/projects/${project.id}`}
			className="group bg-bg-panel rounded-2xl border border-gray-mid overflow-hidden flex flex-col hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
		>
			{/* Image */}
			<div className="relative h-48 bg-bg-dark overflow-hidden">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={project.name}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-primary/30 font-heading text-5xl font-bold">
						{project.name.charAt(0)}
					</div>
				)}
				<div className="absolute top-3 right-3">
					<Badge variant={statusVariant}>{project.status}</Badge>
				</div>
			</div>

			{/* Content */}
			<div className="p-5 flex flex-col flex-1 gap-3">
				<h3 className="font-heading text-primary text-lg tracking-wide">
					{project.name}
				</h3>
				{project.description && (
					<p className="text-text-gray text-sm leading-relaxed flex-1 line-clamp-2">
						{project.description}
					</p>
				)}

				<div className="flex gap-4 text-xs text-text-gray flex-wrap">
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
					<span className={`flex items-center gap-1.5 ${project.is_overdue ? "text-red-400" : ""}`}>
						<Timer className={`w-3 h-3 ${project.is_overdue ? "text-red-400" : "text-primary"}`} />
						{project.is_overdue
							? `${project.days_remaining} days overdue`
							: `${project.days_remaining} days remaining`}
					</span>
				</div>

				{/* Progress */}
				<div className="flex items-center gap-3">
					<div className="flex-1 h-1.5 bg-gray-mid rounded-full overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-500"
							style={{ width: `${project.progress}%`, backgroundColor: progressColor }}
						/>
					</div>
					<span className="text-xs text-text-gray shrink-0">
						{project.progress}%
					</span>
				</div>
			</div>
		</Link>
	);
}
