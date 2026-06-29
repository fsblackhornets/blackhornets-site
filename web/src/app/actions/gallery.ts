"use server";

import { revalidatePath } from "next/cache";
import { apiDelete, apiPost, apiPut } from "@/lib/api-client";

export async function deleteGalleryImageAction(
	id: number,
): Promise<{ error?: string }> {
	try {
		await apiDelete(`gallery/${id}`);
		revalidatePath("/admin/gallery");
		return {};
	} catch {
		return { error: "Failed to delete image." };
	}
}

export async function toggleGalleryImageAction(
	id: number,
): Promise<{ error?: string; is_active?: number }> {
	try {
		const res = await apiPost<{ success: boolean; is_active: number }>(
			`gallery/${id}/toggle`,
			{},
		);
		revalidatePath("/admin/gallery");
		return { is_active: res.is_active };
	} catch {
		return { error: "Failed to toggle image." };
	}
}

export async function uploadGalleryImageAction(
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost("gallery", formData);
		revalidatePath("/admin/gallery");
		return {};
	} catch {
		return { error: "Failed to upload image." };
	}
}

export async function updateGalleryImageAction(
	id: number,
	title: string,
	category: string,
): Promise<{ error?: string }> {
	try {
		await apiPut(`gallery/${id}`, { title, category });
		revalidatePath("/admin/gallery");
		return {};
	} catch {
		return { error: "Failed to update image." };
	}
}
