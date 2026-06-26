import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Timer } from "lucide-react";
import { Badge } from "@/components/ui/components/Badge";
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
		<div className="max-w-[900px] mx-auto px-4 py-16">
			<Link
				href="/projects"
				className="inline-flex items-center gap-2 text-primary font-heading text-sm tracking-widest hover:underline mb-10"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to Projects
			</Link>

			{imageUrl && (
				<div className="relative h-72 rounded-2xl overflow-hidden mb-8 border border-gray-mid">
					<Image
						src={imageUrl}
						alt={project.name}
						fill
						className="object-cover"
						priority
					/>
				</div>
			)}

			<div className="flex items-start gap-4 flex-wrap mb-6">
				<h1 className="font-heading text-[clamp(1.8rem,5vw,3rem)] text-primary tracking-wide flex-1">
					{project.name}
				</h1>
				<Badge variant={statusVariant}>{project.status}</Badge>
			</div>

			{project.description && (
				<p className="text-text-light leading-relaxed text-lg mb-8">
					{project.description}
				</p>
			)}

			{/* Meta */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
				{project.due_date && (
					<div className="bg-bg-panel rounded-xl border border-gray-mid p-4 flex items-center gap-3">
						<Calendar className="w-5 h-5 text-primary shrink-0" />
						<div>
							<p className="text-text-gray text-xs uppercase tracking-widest">
								Due Date
							</p>
							<p className="text-text-light text-sm">
								{formatDate(project.due_date)}
							</p>
						</div>
					</div>
				)}
				{project.duration && (
					<div className="bg-bg-panel rounded-xl border border-gray-mid p-4 flex items-center gap-3">
						<Clock className="w-5 h-5 text-primary shrink-0" />
						<div>
							<p className="text-text-gray text-xs uppercase tracking-widest">
								Duration
							</p>
							<p className="text-text-light text-sm">{project.duration}</p>
						</div>
					</div>
				)}
				<div className="bg-bg-panel rounded-xl border border-gray-mid p-4 flex items-center gap-3">
					<Timer className={`w-5 h-5 shrink-0 ${project.is_overdue ? "text-red-400" : "text-primary"}`} />
					<div>
						<p className="text-text-gray text-xs uppercase tracking-widest">
							Timeline
						</p>
						<p className={`text-sm ${project.is_overdue ? "text-red-400" : "text-text-light"}`}>
							{project.is_overdue
								? `${project.days_remaining} days overdue`
								: `${project.days_remaining} days remaining`}
						</p>
					</div>
				</div>
			</div>

			{/* Progress */}
			<div className="bg-bg-panel rounded-xl border border-gray-mid p-6">
				<div className="flex justify-between items-center mb-3">
					<span className="font-heading text-sm tracking-widest text-primary uppercase">
						Progress
					</span>
					<span className="font-heading text-primary font-bold">
						{project.progress}%
					</span>
				</div>
				<div className="h-3 bg-gray-mid rounded-full overflow-hidden">
					<div
						className="h-full rounded-full transition-all duration-700"
						style={{ width: `${project.progress}%`, backgroundColor: progressColor }}
					/>
				</div>
			</div>
		</div>
	);
}
