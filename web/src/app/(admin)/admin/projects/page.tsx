import Link from "next/link";
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
						<svg
							width="10"
							height="10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					}
				>
					New Project
				</ParaButton>
			</div>

			{projects.length === 0 ? (
				<div className="border border-[#1e1e1e] rounded-sm p-16 text-center">
					<svg
						className="mx-auto mb-4"
						width="36"
						height="36"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(255,215,0,.2)"
						strokeWidth={1.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<rect x="3" y="3" width="7" height="7" />
						<rect x="14" y="3" width="7" height="7" />
						<rect x="14" y="14" width="7" height="7" />
						<rect x="3" y="14" width="7" height="7" />
					</svg>
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
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
									</svg>
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
