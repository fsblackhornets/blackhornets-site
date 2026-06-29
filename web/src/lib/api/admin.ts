import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
	applications,
	contactMessages,
	contentRequests,
	galleryImages,
	projects,
	siteSettings,
	sponsors,
	teamMembers,
	users,
} from "@/lib/db/schema";
import type { Application } from "@/types/application";
import type { GalleryImage } from "@/types/gallery";
import type { AdminMember } from "@/types/member";
import type { ContactMessage } from "@/types/message";
import type { Project } from "@/types/project";
import type { Sponsor } from "@/types/sponsor";

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

export interface ApplicationsResponse {
	data: Application[];
	total: number;
	page: number;
	total_pages: number;
}

export interface BrochureInfo {
	pdf_url: string;
	updated_at: string;
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
	try {
		const [
			[{ pending_applications }],
			[{ total_messages }],
			[{ pending_requests }],
			teamRows,
		] = await Promise.all([
			db
				.select({ pending_applications: sql<number>`COUNT(*)` })
				.from(applications)
				.where(eq(applications.status, "pending")),
			db
				.select({ total_messages: sql<number>`COUNT(*)` })
				.from(contactMessages),
			db
				.select({ pending_requests: sql<number>`COUNT(*)` })
				.from(contentRequests)
				.where(eq(contentRequests.status, "pending")),
			db
				.select({ team: teamMembers.team, count: sql<number>`COUNT(*)` })
				.from(teamMembers)
				.innerJoin(users, eq(teamMembers.user_id, users.id))
				.where(sql`${users.status} = 'active'`)
				.groupBy(teamMembers.team),
		]);

		const by_team: Record<string, number> = {
			mechanical: 0,
			electrical: 0,
			operating_business: 0,
		};
		let total = 0;
		for (const r of teamRows) {
			if (r.team) by_team[r.team] = Number(r.count);
			total += Number(r.count);
		}

		return {
			pending_applications: Number(pending_applications),
			total_messages: Number(total_messages),
			pending_requests: Number(pending_requests),
			team_members: {
				total,
				mechanical: by_team.mechanical ?? 0,
				electrical: by_team.electrical ?? 0,
				business: by_team.operating_business ?? 0,
			},
		};
	} catch {
		return null;
	}
}

export async function fetchApplications(
	status = "",
	page = 1,
): Promise<ApplicationsResponse | null> {
	try {
		const validStatuses = [
			"pending",
			"reviewing",
			"accepted",
			"rejected",
		] as const;
		const statusFilter = validStatuses.includes(
			status as (typeof validStatuses)[number],
		)
			? eq(applications.status, status as (typeof validStatuses)[number])
			: undefined;

		const limit = 10;
		const offset = (page - 1) * limit;

		const [[{ total }], data] = await Promise.all([
			db
				.select({ total: sql<number>`COUNT(*)` })
				.from(applications)
				.where(statusFilter),
			db
				.select()
				.from(applications)
				.where(statusFilter)
				.orderBy(desc(applications.created_at))
				.limit(limit)
				.offset(offset),
		]);

		return {
			data: data as unknown as Application[],
			total: Number(total),
			page,
			total_pages: Math.max(1, Math.ceil(Number(total) / limit)),
		};
	} catch {
		return null;
	}
}

export async function fetchAdminGallery(): Promise<GalleryImage[]> {
	try {
		const data = await db
			.select()
			.from(galleryImages)
			.orderBy(asc(galleryImages.sort_order), asc(galleryImages.created_at));
		return data as unknown as GalleryImage[];
	} catch {
		return [];
	}
}

const memberSelect = {
	id: teamMembers.id,
	user_id: teamMembers.user_id,
	full_name: users.full_name,
	email: users.email,
	phone: users.phone,
	role: users.role,
	status: users.status,
	position: teamMembers.position,
	position_en: teamMembers.position_en,
	academic_year: teamMembers.academic_year,
	study_field: teamMembers.study_field,
	faculty: teamMembers.faculty,
	department: teamMembers.department,
	team: teamMembers.team,
	age: teamMembers.age,
	date_of_birth: teamMembers.date_of_birth,
	profile_picture: teamMembers.profile_picture,
	image_position: teamMembers.image_position,
	motivation: teamMembers.motivation,
	skills: teamMembers.skills,
	projects: teamMembers.projects,
	achievements: teamMembers.achievements,
	created_at: teamMembers.created_at,
} as const;

export async function fetchAdminMembers(): Promise<AdminMember[]> {
	try {
		const data = await db
			.select(memberSelect)
			.from(teamMembers)
			.innerJoin(users, eq(teamMembers.user_id, users.id))
			.orderBy(asc(users.full_name));
		return data as unknown as AdminMember[];
	} catch {
		return [];
	}
}

export async function fetchAdminMember(
	id: number,
): Promise<AdminMember | null> {
	try {
		const [row] = await db
			.select(memberSelect)
			.from(teamMembers)
			.innerJoin(users, eq(teamMembers.user_id, users.id))
			.where(eq(teamMembers.id, id))
			.limit(1);
		return (row as unknown as AdminMember) ?? null;
	} catch {
		return null;
	}
}

export async function fetchMessages(
	page = 1,
): Promise<MessagesResponse | null> {
	try {
		const limit = 10;
		const offset = (page - 1) * limit;

		const [[{ total }], data] = await Promise.all([
			db.select({ total: sql<number>`COUNT(*)` }).from(contactMessages),
			db
				.select()
				.from(contactMessages)
				.orderBy(desc(contactMessages.created_at))
				.limit(limit)
				.offset(offset),
		]);

		return {
			data: data as unknown as ContactMessage[],
			total: Number(total),
			page,
			total_pages: Math.max(1, Math.ceil(Number(total) / limit)),
		};
	} catch {
		return null;
	}
}

export async function fetchAdminProjects(): Promise<Project[]> {
	try {
		const data = await db
			.select()
			.from(projects)
			.orderBy(desc(projects.created_at));
		return data as unknown as Project[];
	} catch {
		return [];
	}
}

export async function fetchAdminProject(id: number): Promise<Project | null> {
	try {
		const [row] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, id))
			.limit(1);
		return (row as unknown as Project) ?? null;
	} catch {
		return null;
	}
}

export async function fetchAdminSponsors(): Promise<Sponsor[]> {
	try {
		const data = await db
			.select()
			.from(sponsors)
			.orderBy(asc(sponsors.tier_order), asc(sponsors.name));
		return data as unknown as Sponsor[];
	} catch {
		return [];
	}
}

export async function fetchAdminSponsor(id: number): Promise<Sponsor | null> {
	try {
		const [row] = await db
			.select()
			.from(sponsors)
			.where(eq(sponsors.id, id))
			.limit(1);
		return (row as unknown as Sponsor) ?? null;
	} catch {
		return null;
	}
}

export async function fetchAdminBrochure(): Promise<{
	sr: BrochureInfo | null;
	en: BrochureInfo | null;
}> {
	try {
		const [srRows, enRows] = await Promise.all([
			db
				.select()
				.from(siteSettings)
				.where(eq(siteSettings.setting_key, "brochure_pdf_sr")),
			db
				.select()
				.from(siteSettings)
				.where(eq(siteSettings.setting_key, "brochure_pdf_en")),
		]);
		return {
			sr: srRows[0]
				? {
						pdf_url: srRows[0].setting_value,
						updated_at: srRows[0].updated_at.toString(),
					}
				: null,
			en: enRows[0]
				? {
						pdf_url: enRows[0].setting_value,
						updated_at: enRows[0].updated_at.toString(),
					}
				: null,
		};
	} catch {
		return { sr: null, en: null };
	}
}
