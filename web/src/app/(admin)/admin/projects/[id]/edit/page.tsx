import Link from "next/link";
import { notFound } from "next/navigation";
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
					className="text-text-gray hover:text-primary transition-colors"
				>
					<i className="fas fa-arrow-left" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Edit Project
				</h1>
			</div>
			<ProjectForm action={action} project={project} />
		</div>
	);
}
