"use server";

import { revalidatePath } from "next/cache";
import { apiDelete } from "@/lib/api-client";

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
