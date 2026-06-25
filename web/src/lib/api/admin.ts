import { apiGet } from "@/lib/api-client";
import type { ContactMessage } from "@/types/message";

export interface DashboardStats {
	pending_applications: number;
	total_messages: number;
	pending_requests: number;
	team_members: {
		total: number;
		mechanical: number;
		electrical: number;
		business: number;
	};
}

export interface MessagesResponse {
	data: ContactMessage[];
	total: number;
	page: number;
	total_pages: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
	try {
		return await apiGet<DashboardStats>("admin/stats", {
			next: { revalidate: 60 },
		});
	} catch {
		return null;
	}
}

export async function fetchMessages(
	page = 1,
): Promise<MessagesResponse | null> {
	try {
		return await apiGet<MessagesResponse>(`admin/messages?page=${page}`, {
			cache: "no-store",
		});
	} catch {
		return null;
	}
}
