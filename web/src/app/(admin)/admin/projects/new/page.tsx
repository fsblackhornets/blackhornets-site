import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
					className="text-primary hover:text-primary/70 transition-colors"
					aria-label="Back"
				>
					<ChevronLeft size={16} strokeWidth={2} stroke="#ffd700" aria-hidden="true" />
				</Link>
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					New Project
				</h1>
			</div>
			<ProjectForm action={createProjectAction} />
		</div>
	);
}
