import Link from "next/link";
import { FileEdit, LayoutGrid, Plus } from "lucide-react";
import { Badge } from "@/components/ui/components/Badge";
import { ParaButton } from "@/components/ui/components/ParaButton";
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
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Projects
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<span className="font-body text-[8.5px] text-[#444]">
					{projects.length} total
				</span>
				<ParaButton
					href="/admin/projects/new"
					size="sm"
					icon={
						<Plus size={10} strokeWidth={2.5} aria-hidden="true" />
					}
				>
					New Project
				</ParaButton>
			</div>

			{projects.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<LayoutGrid size={36} strokeWidth={1.5} stroke="rgba(255,215,0,.2)" className="mx-auto mb-4" aria-hidden="true" />
					<p className="font-heading text-[9px] tracking-[3px] uppercase text-[#333]">
						No projects yet.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{projects.map((project) => (
						<div
							key={project.id}
							className="bg-[#111] border border-[#1e1e1e] border-l-[2px] border-l-primary/20 rounded-sm px-5 py-4 flex items-center gap-4 hover:border-l-primary/60 transition-colors"
						>
							<div className="flex-1 min-w-0">
								<p className="font-body font-semibold text-[10px] text-[#e0e0e0] truncate">
									{project.name}
								</p>
								<div className="flex gap-3 mt-1 font-body text-[8px] text-[#444]">
									<span>{formatDate(project.created_at)}</span>
									{project.duration && <span>{project.duration}</span>}
									<span>{project.progress}%</span>
								</div>
							</div>

							<div className="w-24 h-[4px] bg-[#1e1e1e] rounded-none overflow-hidden shrink-0">
								<div
									className="h-full bg-primary rounded-none"
									style={{ width: `${project.progress}%` }}
								/>
							</div>

							<Badge variant={getProjectStatusVariant(project.status)}>
								{project.status}
							</Badge>

							<div className="flex gap-2 shrink-0">
								<Link
									href={`/admin/projects/${project.id}/edit`}
									className="text-[#444] hover:text-primary transition-colors p-1"
									aria-label="Edit project"
								>
									<FileEdit size={13} strokeWidth={2} aria-hidden="true" />
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
