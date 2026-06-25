import Link from "next/link";
import { Badge } from "@/components/ui/components/Badge";
import { Button } from "@/components/ui/components/Button";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAdminProjects } from "@/lib/api/admin";
import { formatDate, getProjectStatusVariant } from "@/lib/utils/utils";
import { ProjectDeleteButton } from "./ProjectDeleteButton";

export const metadata = buildAdminMeta("Projects");

export default async function ProjectsAdminPage() {
	const projects = await fetchAdminProjects();

	return (
		<div className="max-w-[1000px]">
			<div className="flex items-center gap-3 mb-6">
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Projects
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<Button href="/admin/projects/new" size="sm">
					<i className="fas fa-plus" aria-hidden="true" />
					New Project
				</Button>
			</div>

			{projects.length === 0 ? (
				<div className="bg-[#111] border border-primary/12 rounded-2xl p-16 text-center text-text-gray">
					<i
						className="fas fa-project-diagram text-4xl text-primary/30 mb-4 block"
						aria-hidden="true"
					/>
					No projects yet.
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{projects.map((project) => (
						<div
							key={project.id}
							className="bg-[#111] border border-primary/12 rounded-xl px-5 py-4 flex items-center gap-4"
						>
							<div className="flex-1 min-w-0">
								<p className="text-text-light font-semibold text-sm truncate">
									{project.name}
								</p>
								<div className="flex gap-3 mt-1 text-xs text-text-gray">
									<span>{formatDate(project.created_at)}</span>
									{project.duration && <span>{project.duration}</span>}
									<span>{project.progress}%</span>
								</div>
							</div>

							<div className="w-24 h-1.5 bg-gray-mid rounded-full overflow-hidden shrink-0">
								<div
									className="h-full bg-primary rounded-full"
									style={{ width: `${project.progress}%` }}
								/>
							</div>

							<Badge variant={getProjectStatusVariant(project.status)}>
								{project.status}
							</Badge>

							<div className="flex gap-2 shrink-0">
								<Link
									href={`/admin/projects/${project.id}/edit`}
									className="text-text-gray hover:text-primary transition-colors text-sm px-2"
								>
									<i className="fas fa-pen" aria-hidden="true" />
								</Link>
								<ProjectDeleteButton id={project.id} name={project.name} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
