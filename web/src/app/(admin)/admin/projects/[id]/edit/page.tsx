import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { updateProjectAction } from "@/app/actions/projects";
import { ProjectForm } from "@/components/forms/projects/ProjectForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAdminProject } from "@/lib/api/admin";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
	const { id } = await params;
	const project = await fetchAdminProject(Number(id));
	return buildAdminMeta("Projects", `Edit: ${project?.name ?? "Project"}`);
}

export default async function EditProjectPage({ params }: Props) {
	const { id } = await params;
	const project = await fetchAdminProject(Number(id));
	if (!project) notFound();

	const action = updateProjectAction.bind(null, project.id);

	return (
		<div className="max-w-[720px]">
			<div className="flex items-center gap-3 mb-6">
				<Link
					href="/admin/projects"
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<ChevronLeft size={16} strokeWidth={2} stroke="#ffd700" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Edit Project
				</h1>
			</div>
			<ProjectForm action={action} project={project} />
		</div>
	);
}
