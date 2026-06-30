"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiDelete, apiPost, apiPut } from "@/lib/api-client";

export async function createMemberAction(
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost("admin/members", formData);
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
		await apiPost(`admin/members/${id}`, formData);
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
