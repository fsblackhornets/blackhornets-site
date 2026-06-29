"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiDelete, apiPost, apiPut } from "@/lib/api-client";

function parseMemberFormData(formData: FormData) {
	return {
		full_name: (formData.get("full_name") as string) ?? "",
		email: (formData.get("email") as string) ?? null,
		phone: (formData.get("phone") as string) ?? null,
		role: (formData.get("role") as string) ?? "team_member",
		team: (formData.get("team") as string) ?? null,
		department: (formData.get("department") as string) ?? null,
		study_field: (formData.get("study_field") as string) ?? null,
		position: (formData.get("position") as string) ?? null,
	};
}

export async function createMemberAction(
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost("admin/members", parseMemberFormData(formData));
		revalidatePath("/admin/members");
	} catch {
		return { error: "Failed to create member." };
	}
	redirect("/admin/members");
}

export async function updateMemberAction(
	id: number,
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPut(`admin/members/${id}`, parseMemberFormData(formData));
		revalidatePath("/admin/members");
	} catch {
		return { error: "Failed to update member." };
	}
	redirect("/admin/members");
}

export async function deleteMemberAction(
	id: number,
): Promise<{ error?: string }> {
	try {
		await apiDelete(`admin/members/${id}`);
		revalidatePath("/admin/members");
		return {};
	} catch {
		return { error: "Failed to delete member." };
	}
}

export async function toggleMemberStatusAction(
	id: number,
): Promise<{ error?: string; status?: string }> {
	try {
		const res = await apiPost<{ success: boolean; status: string }>(
			`admin/members/${id}/toggle`,
			{},
		);
		revalidatePath("/admin/members");
		return { status: res.status };
	} catch {
		return { error: "Failed to toggle status." };
	}
}
