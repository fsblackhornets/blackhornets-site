import { apiGet } from "@/lib/api-client";
import type { Project } from "@/types/project";

interface ProjectsResponse {
	success: boolean;
	data: Project[];
}

interface ProjectResponse {
	success: boolean;
	data: Project;
}

export async function fetchProjects(): Promise<Project[]> {
	try {
		const res = await apiGet<ProjectsResponse>("projects", {
			next: { revalidate: 300 },
		});
		return res.data ?? [];
	} catch {
		return [];
	}
}

export async function fetchProject(id: number): Promise<Project | null> {
	try {
		const res = await apiGet<ProjectResponse>(`projects/${id}`, {
			next: { revalidate: 300 },
		});
		return res.data ?? null;
	} catch {
		return null;
	}
}
