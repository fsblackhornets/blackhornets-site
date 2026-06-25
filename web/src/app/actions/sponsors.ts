"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiDelete, apiPost } from "@/lib/api-client";

export async function deleteSponsorAction(
	id: number,
): Promise<{ error?: string }> {
	try {
		await apiDelete(`admin/sponsors/${id}`);
		revalidatePath("/admin/sponsors");
		revalidatePath("/sponsors");
		return {};
	} catch {
		return { error: "Failed to delete sponsor." };
	}
}

export async function createSponsorAction(
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost("admin/sponsors", formData);
		revalidatePath("/admin/sponsors");
		revalidatePath("/sponsors");
	} catch {
		return { error: "Failed to create sponsor." };
	}
	redirect("/admin/sponsors");
}

export async function updateSponsorAction(
	id: number,
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost(`admin/sponsors/${id}`, formData);
		revalidatePath("/admin/sponsors");
		revalidatePath("/sponsors");
	} catch {
		return { error: "Failed to update sponsor." };
	}
	redirect("/admin/sponsors");
}
