"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { apiPost } from "@/lib/api-client";
import { db } from "@/lib/db";
import { contentRequests } from "@/lib/db/schema";

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

export async function resubmitRequestAction(
	originalId: number,
	_prev: { error?: string; success?: string },
	formData: FormData,
): Promise<{ error?: string; success?: string }> {
	try {
		const session = await auth();
		if (!session?.user) return { error: "Not authenticated." };

		const [original] = await db
			.select({ type: contentRequests.type })
			.from(contentRequests)
			.where(eq(contentRequests.id, originalId))
			.limit(1);

		if (!original) return { error: "Original request not found." };

		const data: Record<string, unknown> = {};
		for (const [key, val] of formData.entries()) {
			if (!key.startsWith("_") && key !== "type") {
				data[key] = val instanceof File ? val.name : val;
			}
		}

		const galleryRaw = formData.get("gallery_items");
		if (galleryRaw && typeof galleryRaw === "string") {
			try {
				data.gallery_items = JSON.parse(galleryRaw);
			} catch {
				/* ignore */
			}
		}

		await db.insert(contentRequests).values({
			type: original.type,
			data,
			submitted_by: Number(session.user.id),
			submitter_name: session.user.full_name ?? "",
			status: "pending",
		});

		revalidatePath("/manager/requests");
	} catch {
		return { error: "Failed to resubmit. Please try again." };
	}
	redirect("/manager/requests");
}

export async function editAndApproveAction(
	requestId: number,
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		const session = await auth();
		const editedData: Record<string, unknown> = {};
		for (const [key, val] of formData.entries()) {
			if (!key.startsWith("_")) {
				editedData[key] = val instanceof File ? null : val;
			}
		}
		const galleryRaw = formData.get("gallery_items");
		if (galleryRaw && typeof galleryRaw === "string") {
			try {
				editedData.gallery_items = JSON.parse(galleryRaw);
			} catch {
				/* ignore */
			}
		}
		await apiPost(`requests/${requestId}/review`, {
			id: requestId,
			action: "approve",
			notes: null,
			editedData,
			reviewed_by: Number(session?.user?.id ?? 0),
			_role: session?.user?.role ?? "admin",
		});
		revalidatePath("/admin/requests");
		revalidatePath(`/admin/requests/${requestId}`);
	} catch {
		return { error: "Failed to approve request. Please try again." };
	}
	redirect("/admin/requests");
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
