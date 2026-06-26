"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { apiPost } from "@/lib/api-client";

export async function submitRequestAction(
	_prev: { error?: string; success?: string },
	formData: FormData,
): Promise<{ error?: string; success?: string }> {
	try {
		const session = await auth();
		if (!session?.user) return { error: "Not authenticated." };

		formData.set("_user_id", String(session.user.id));
		formData.set("_user_name", session.user.full_name ?? "");
		formData.set("_role", session.user.role ?? "manager");

		await apiPost("requests", formData);
		revalidatePath("/manager/requests");
		return { success: "Request submitted. Awaiting admin approval." };
	} catch {
		return { error: "Failed to submit request. Please try again." };
	}
}

export async function reviewRequestAction(
	id: number,
	action: "approve" | "decline",
	notes: string,
	editedData?: Record<string, unknown>,
): Promise<{ error?: string }> {
	try {
		const session = await auth();
		await apiPost(`requests/${id}/review`, {
			id,
			action,
			notes: notes || null,
			editedData: editedData ?? null,
			reviewed_by: Number(session?.user?.id ?? 0),
			_role: session?.user?.role ?? "admin",
		});
		revalidatePath("/admin/requests");
		revalidatePath(`/admin/requests/${id}`);
	} catch {
		return { error: "Failed to process request. Please try again." };
	}
	redirect("/admin/requests");
}
