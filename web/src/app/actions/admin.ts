"use server";

import { revalidatePath } from "next/cache";
import { apiDelete, apiPost } from "@/lib/api-client";
import type { ApplicationStatus } from "@/types/application";

export async function reviewApplicationAction(
	id: number,
	action: "accept" | "reject" | "review",
): Promise<{ error?: string; status?: ApplicationStatus }> {
	try {
		const res = await apiPost<{ success: boolean; status: ApplicationStatus }>(
			`admin/applications/${id}/review`,
			{ action },
		);
		revalidatePath("/admin/applications");
		return { status: res.status };
	} catch {
		return { error: "Failed to update application." };
	}
}

export async function deleteMessageAction(
	id: number,
): Promise<{ error?: string }> {
	try {
		await apiDelete(`admin/messages/${id}`);
		revalidatePath("/admin/messages");
		return {};
	} catch {
		return { error: "Failed to delete message." };
	}
}
