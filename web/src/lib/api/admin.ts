import { apiGet } from "@/lib/api-client";
import type { Application } from "@/types/application";
import type { AdminMember } from "@/types/member";
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

export interface ApplicationsResponse {
	data: Application[];
	total: number;
	page: number;
	total_pages: number;
}

export async function fetchApplications(
	status = "",
	page = 1,
): Promise<ApplicationsResponse | null> {
	try {
		const params = new URLSearchParams({ page: String(page) });
		if (status) params.set("status", status);
		return await apiGet<ApplicationsResponse>(`admin/applications?${params}`, {
			cache: "no-store",
		});
	} catch {
		return null;
	}
}

export async function fetchAdminGallery(): Promise<
	import("@/types/gallery").GalleryImage[]
> {
	try {
		const res = await apiGet<{
			success: boolean;
			data: import("@/types/gallery").GalleryImage[];
		}>("admin/gallery", { cache: "no-store" });
		return res.data ?? [];
	} catch {
		return [];
	}
}

export async function fetchAdminMembers(): Promise<AdminMember[]> {
	try {
		const res = await apiGet<{ data: AdminMember[] }>("admin/members", {
			cache: "no-store",
		});
		return res.data ?? [];
	} catch {
		return [];
	}
}

export async function fetchAdminMember(
	id: number,
): Promise<AdminMember | null> {
	try {
		const res = await apiGet<{ data: AdminMember }>(`admin/members/${id}`, {
			cache: "no-store",
		});
		return res.data ?? null;
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

export async function fetchAdminProjects(): Promise<
	import("@/types/project").Project[]
> {
	try {
		const res = await apiGet<{
			success: boolean;
			data: import("@/types/project").Project[];
		}>("admin/projects", { cache: "no-store" });
		return res.data ?? [];
	} catch {
		return [];
	}
}

export async function fetchAdminProject(
	id: number,
): Promise<import("@/types/project").Project | null> {
	try {
		const res = await apiGet<{
			success: boolean;
			data: import("@/types/project").Project;
		}>(`admin/projects/${id}`, { cache: "no-store" });
		return res.data ?? null;
	} catch {
		return null;
	}
}

export async function fetchAdminSponsors(): Promise<
	import("@/types/sponsor").Sponsor[]
> {
	try {
		const res = await apiGet<{
			success: boolean;
			data: import("@/types/sponsor").Sponsor[];
		}>("admin/sponsors", { cache: "no-store" });
		return res.data ?? [];
	} catch {
		return [];
	}
}

export async function fetchAdminSponsor(
	id: number,
): Promise<import("@/types/sponsor").Sponsor | null> {
	try {
		const res = await apiGet<{
			success: boolean;
			data: import("@/types/sponsor").Sponsor;
		}>(`admin/sponsors/${id}`, { cache: "no-store" });
		return res.data ?? null;
	} catch {
		return null;
	}
}

export interface BrochureInfo {
	pdf_url: string;
	updated_at: string;
}

export async function fetchAdminBrochure(): Promise<{
	sr: BrochureInfo | null;
	en: BrochureInfo | null;
}> {
	try {
		const res = await apiGet<{
			success: boolean;
			data: { sr: BrochureInfo | null; en: BrochureInfo | null };
		}>("admin/brochure", { cache: "no-store" });
		return res.data ?? { sr: null, en: null };
	} catch {
		return { sr: null, en: null };
	}
}
