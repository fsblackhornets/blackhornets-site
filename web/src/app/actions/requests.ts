"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildRequestData } from "@/lib/api/requestData";
import { apiPost } from "@/lib/api-client";
import { db } from "@/lib/db";
import { contentRequests } from "@/lib/db/schema";

async function sessionCookieHeader(): Promise<Record<string, string>> {
	const store = await cookies();
	const header = store
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");
	return header ? { Cookie: header } : {};
}

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

		await apiPost("requests", formData, await sessionCookieHeader());
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

		const data = await buildRequestData(formData, original.type);

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
		await apiPost(
			`requests/${requestId}/review`,
			{
				id: requestId,
				action: "approve",
				notes: null,
				editedData,
				reviewed_by: Number(session?.user?.id ?? 0),
				_role: session?.user?.role ?? "admin",
			},
			await sessionCookieHeader(),
		);
		revalidatePath("/admin/requests");
		revalidatePath(`/admin/requests/${requestId}`);
		revalidatePublicPaths();
	} catch {
		return { error: "Failed to approve request. Please try again." };
	}
	redirect("/admin/requests");
}

function revalidatePublicPaths() {
	revalidatePath("/blog");
	revalidatePath("/projects");
	revalidatePath("/sponsors");
	revalidatePath("/team");
	revalidatePath("/gallery");
	revalidatePath("/");
}

export async function reviewRequestAction(
	id: number,
	action: "approve" | "decline",
	notes: string,
	editedData?: Record<string, unknown>,
): Promise<{ error?: string }> {
	try {
		const session = await auth();
		await apiPost(
			`requests/${id}/review`,
			{
				id,
				action,
				notes: notes || null,
				editedData: editedData ?? null,
				reviewed_by: Number(session?.user?.id ?? 0),
				_role: session?.user?.role ?? "admin",
			},
			await sessionCookieHeader(),
		);
		revalidatePath("/admin/requests");
		revalidatePath(`/admin/requests/${id}`);
		if (action === "approve") revalidatePublicPaths();
	} catch {
		return { error: "Failed to process request. Please try again." };
	}
	redirect("/admin/requests");
}
