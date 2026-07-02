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

export function FeaturedProjectCard({ project }: { project: Project }) {
	const imageUrl = project.image_url
		? buildProjectImageUrl(project.image_url)
		: null;
	const statusVariant = getProjectStatusVariant(project.status);

	return (
		<Link
			href={`/projects/${project.id}`}
			className="group bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary overflow-hidden flex flex-col lg:flex-row hover:border-primary/60 transition-all duration-300"
		>
			{/* Image */}
			<div className="relative h-64 lg:h-auto lg:w-[45%] shrink-0 bg-bg-dark overflow-hidden">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={project.name}
						fill
						className="object-contain transition-transform duration-500 group-hover:scale-105"
						priority
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-primary/20 font-heading text-8xl font-bold">
						{project.name.charAt(0)}
					</div>
				)}
				{/* Diagonal fade to panel */}
				<div
					className="absolute inset-0 hidden lg:block"
					style={{
						background:
							"linear-gradient(100deg, transparent 45%, var(--color-bg-panel) 75%)",
					}}
				/>
				{/* Featured badge */}
				<div className="absolute top-4 left-4">
					<span
						className="font-heading text-[7px] tracking-[3px] uppercase text-primary bg-black/70 px-2.5 py-1"
						style={{
							clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
						}}
					>
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
					<span
						className="font-heading text-[7px] tracking-[2px] uppercase px-2.5 py-1 self-start"
						style={{
							clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
							...statusStyle(statusVariant),
						}}
					>
						{project.status}
					</span>
				</div>

				{project.description && (
					<p className="text-text-gray leading-relaxed line-clamp-3 font-body text-sm">
						{project.description}
					</p>
				)}

				<div className="flex gap-5 text-xs text-text-gray flex-wrap font-body">
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
					<span
						className={`flex items-center gap-1.5 ${project.is_overdue ? "text-red-400" : ""}`}
					>
						<Timer
							className={`w-3.5 h-3.5 ${project.is_overdue ? "text-red-400" : "text-primary"}`}
						/>
						{project.is_overdue
							? `${project.days_remaining} days overdue`
							: `${project.days_remaining} days remaining`}
					</span>
				</div>

				{/* Progress */}
				<div className="flex flex-col gap-1.5 mt-2">
					<span className="font-heading text-[7px] tracking-[3px] uppercase text-text-gray/50">
						Progress
					</span>
					<div className="flex items-center gap-3">
						<div className="flex-1 h-1 bg-bg-dark overflow-hidden">
							<div
								className="h-full transition-all duration-700"
								style={{
									width: `${project.progress}%`,
									background: "linear-gradient(90deg, #ffd700, #ffc107)",
								}}
							/>
						</div>
						<span className="text-sm font-heading text-primary shrink-0">
							{project.progress}%
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
