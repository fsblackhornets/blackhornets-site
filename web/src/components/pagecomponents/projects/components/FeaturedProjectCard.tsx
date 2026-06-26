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

export function FeaturedProjectCard({ project }: { project: Project }) {
	const imageUrl = project.image_url
		? buildProjectImageUrl(project.image_url)
		: null;
	const progressColor = getProgressColor(project.progress);
	const statusVariant = getProjectStatusVariant(project.status);

	return (
		<Link
			href={`/projects/${project.id}`}
			className="group bg-bg-panel rounded-2xl border border-primary/40 overflow-hidden flex flex-col lg:flex-row hover:border-primary transition-all duration-300 hover:-translate-y-1"
		>
			{/* Image */}
			<div className="relative h-64 lg:h-auto lg:w-[45%] shrink-0 bg-bg-dark overflow-hidden">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={project.name}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						priority
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-primary/20 font-heading text-8xl font-bold">
						{project.name.charAt(0)}
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg-panel/60 hidden lg:block" />
				<div className="absolute top-4 left-4">
					<span className="font-heading text-xs tracking-[4px] text-primary/70 uppercase bg-black/50 px-3 py-1 rounded-full backdrop-blur">
						Featured
					</span>
				</div>
			</div>

			{/* Content */}
			<div className="p-8 flex flex-col gap-4 flex-1 justify-center">
				<div className="flex items-start gap-3 flex-wrap">
					<h2 className="font-heading text-[clamp(1.5rem,3vw,2.2rem)] text-primary tracking-wide flex-1">
						{project.name}
					</h2>
					<Badge variant={statusVariant}>{project.status}</Badge>
				</div>

				{project.description && (
					<p className="text-text-gray leading-relaxed line-clamp-3">
						{project.description}
					</p>
				)}

				<div className="flex gap-5 text-xs text-text-gray flex-wrap">
					{project.due_date && (
						<span className="flex items-center gap-1.5">
							<Calendar className="w-3.5 h-3.5 text-primary" />
							{formatDate(project.due_date)}
						</span>
					)}
					{project.duration && (
						<span className="flex items-center gap-1.5">
							<Clock className="w-3.5 h-3.5 text-primary" />
							{project.duration}
						</span>
					)}
					<span className={`flex items-center gap-1.5 ${project.is_overdue ? "text-red-400" : ""}`}>
						<Timer className={`w-3.5 h-3.5 ${project.is_overdue ? "text-red-400" : "text-primary"}`} />
						{project.is_overdue
							? `${project.days_remaining} days overdue`
							: `${project.days_remaining} days remaining`}
					</span>
				</div>

				{/* Progress */}
				<div className="flex items-center gap-3 mt-2">
					<div className="flex-1 h-2 bg-gray-mid rounded-full overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-700"
							style={{ width: `${project.progress}%`, backgroundColor: progressColor }}
						/>
					</div>
					<span className="text-sm font-heading text-primary shrink-0">
						{project.progress}%
					</span>
				</div>
			</div>
		</Link>
	);
}
