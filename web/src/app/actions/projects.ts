"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiDelete, apiPost } from "@/lib/api-client";

export async function deleteProjectAction(
	id: number,
): Promise<{ error?: string }> {
	try {
		await apiDelete(`admin/projects/${id}`);
		revalidatePath("/admin/projects");
		revalidatePath("/projects");
		return {};
	} catch {
		return { error: "Failed to delete project." };
	}
}

export async function createProjectAction(
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost("admin/projects", formData);
		revalidatePath("/admin/projects");
		revalidatePath("/projects");
	} catch {
		return { error: "Failed to create project." };
	}
	redirect("/admin/projects");
}

export async function updateProjectAction(
	id: number,
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost(`admin/projects/${id}`, formData);
		revalidatePath("/admin/projects");
		revalidatePath("/projects");
	} catch {
		return { error: "Failed to update project." };
	}
	redirect("/admin/projects");
}
