"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiDelete, apiPost } from "@/lib/api-client";

export async function deletePostAction(
	id: number,
): Promise<{ error?: string }> {
	try {
		await apiDelete(`posts/${id}`);
		revalidatePath("/admin/posts");
		return {};
	} catch {
		return { error: "Failed to delete post." };
	}
}

export async function togglePostStatusAction(
	id: number,
): Promise<{ error?: string; status?: string }> {
	try {
		const res = await apiPost<{ status: string; new_status: string }>(
			`posts/${id}/toggle`,
			{},
		);
		revalidatePath("/admin/posts");
		return { status: res.new_status };
	} catch {
		return { error: "Failed to toggle status." };
	}
}

export async function createPostAction(
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost("posts", formData);
		revalidatePath("/admin/posts");
		revalidatePath("/blog");
	} catch {
		return { error: "Failed to create post." };
	}
	redirect("/admin/posts");
}

export async function updatePostAction(
	id: number,
	_prev: { error?: string },
	formData: FormData,
): Promise<{ error?: string }> {
	try {
		await apiPost(`posts/${id}`, formData);
		revalidatePath("/admin/posts");
		revalidatePath("/blog");
	} catch {
		return { error: "Failed to update post." };
	}
	redirect("/admin/posts");
}
