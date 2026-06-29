"use server";

import { revalidatePath } from "next/cache";
import { apiPost } from "@/lib/api-client";

export async function uploadBrochureAction(
	_prev: { error?: string; success?: string },
	formData: FormData,
): Promise<{ error?: string; success?: string }> {
	try {
		await apiPost("admin/brochure", formData);
		revalidatePath("/admin/sponsors");
		return { success: "Brochure uploaded successfully." };
	} catch {
		return { error: "Failed to upload brochure." };
	}
}
