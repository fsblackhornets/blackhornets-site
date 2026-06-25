import { apiGet } from "@/lib/api-client";
import type { ContentRequest } from "@/types/request";

export async function fetchRequests(options: {
	userId?: number;
	role?: string;
	status?: string;
	type?: string;
}): Promise<ContentRequest[]> {
	try {
		const params = new URLSearchParams();
		if (options.userId) params.set("_user_id", String(options.userId));
		if (options.role) params.set("_role", options.role);
		if (options.status) params.set("status", options.status);
		if (options.type) params.set("type", options.type);
		const query = params.toString();
		const res = await apiGet<{ success: boolean; data: ContentRequest[] }>(
			`requests${query ? `?${query}` : ""}`,
			{ cache: "no-store" },
		);
		return res.data ?? [];
	} catch {
		return [];
	}
}

export async function fetchRequest(id: number): Promise<ContentRequest | null> {
	try {
		const res = await apiGet<{ success: boolean; data: ContentRequest }>(
			`requests/${id}`,
			{ cache: "no-store" },
		);
		return res.data ?? null;
	} catch {
		return null;
	}
}
