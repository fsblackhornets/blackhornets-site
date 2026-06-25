import Link from "next/link";
import { createProjectAction } from "@/app/actions/projects";
import { ProjectForm } from "@/components/forms/projects/ProjectForm";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";

export const metadata = buildAdminMeta("Projects", "New Project");

export default function NewProjectPage() {
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
					New Project
				</h1>
			</div>
			<ProjectForm action={createProjectAction} />
		</div>
	);
}
