import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
	contentRequests,
	galleryImages,
	posts,
	projects,
	sponsors,
	teamMembers,
} from "@/lib/db/schema";

type ReviewBody = {
	action: "approve" | "decline";
	notes?: string;
	editedData?: Record<string, unknown>;
	reviewed_by?: number;
};

async function insertContent(
	tx: typeof db,
	type: string,
	data: Record<string, unknown>,
) {
	if (type === "project") {
		await tx.insert(projects).values({
			name: String(data.name ?? ""),
			description: String(data.description ?? ""),
			status: String(data.status ?? "Active"),
			progress: Number(data.progress ?? 0),
			due_date: (data.due_date as string) ?? null,
			duration: (data.duration as string) ?? null,
			image: (data.image as string) ?? null,
			image_position: String(data.image_position ?? "50% 50%"),
		});
	} else if (type === "post") {
		await tx.insert(posts).values({
			title: String(data.title_sr ?? ""),
			title_sr: String(data.title_sr ?? ""),
			title_en: (data.title_en as string) ?? null,
			content: String(data.content_sr ?? ""),
			content_sr: String(data.content_sr ?? ""),
			content_en: (data.content_en as string) ?? null,
			author: String(data.author ?? "Manager"),
			category: (data.category as string) ?? null,
			image: (data.image as string) ?? null,
			image_position: String(data.image_position ?? "50% 50%"),
			status: "published",
		});
		if (Array.isArray(data.gallery_items)) {
			for (const item of data.gallery_items as Array<{
				src: string;
				galleryCategory: string;
				alt?: string;
				caption?: string;
			}>) {
				if (item.galleryCategory && item.galleryCategory !== "none") {
					await tx.insert(galleryImages).values({
						image_path: item.src,
						category: item.galleryCategory,
						alt_text: item.alt ?? null,
						title: item.caption ?? null,
						is_active: 1,
					});
				}
			}
		}
	} else if (type === "sponsor") {
		await tx.insert(sponsors).values({
			name: String(data.name ?? ""),
			tier: String(data.tier ?? ""),
			website: (data.website as string) ?? null,
			description: String(data.description_sr ?? ""),
			description_en: (data.description_en as string) ?? null,
			logo: (data.logo as string) ?? null,
			image_position: String(data.image_position ?? "50% 50%"),
		});
	} else if (type === "gallery") {
		const items =
			(data.gallery_items as Array<{
				src: string;
				galleryCategory: string;
				alt?: string;
				caption?: string;
			}>) ?? [];
		for (const item of items) {
			await tx.insert(galleryImages).values({
				image_path: item.src,
				category: item.galleryCategory || "team",
				alt_text: item.alt ?? null,
				title: item.caption ?? null,
				is_active: 1,
			});
		}
	} else if (type === "member") {
		await tx.insert(teamMembers).values({
			full_name: String(data.full_name ?? ""),
			email: (data.email as string) ?? null,
			phone: (data.phone as string) ?? null,
			role: (data.role as "team_member") ?? "team_member",
			team: (data.team as string) ?? null,
			department: (data.department as string) ?? null,
			study_field: (data.study_field as string) ?? null,
			position: (data.position as string) ?? null,
			profile_picture: (data.profile_picture as string) ?? null,
			image_position: String(data.image_position ?? "50% 50%"),
			faculty: (data.faculty as string) ?? null,
			academic_year: (data.academic_year as string) ?? null,
			status: "active",
		});
	}
}

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const numId = Number(id);
		const body = (await req.json()) as ReviewBody;
		const { action, notes, editedData, reviewed_by } = body;

		if (!["approve", "decline"].includes(action)) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		const [request] = await db
			.select()
			.from(contentRequests)
			.where(
				sql`${contentRequests.id} = ${numId} AND ${contentRequests.status} = 'pending'`,
			);

		if (!request) {
			return NextResponse.json(
				{ error: "Request not found or already reviewed" },
				{ status: 404 },
			);
		}

		const reviewerId = reviewed_by ?? Number(session.user.id);

		if (action === "approve") {
			const dataToInsert = (editedData ?? request.data) as Record<
				string,
				unknown
			>;
			await db.transaction(async (tx) => {
				await insertContent(
					tx as unknown as typeof db,
					request.type,
					dataToInsert,
				);
				await tx
					.update(contentRequests)
					.set({
						status: "approved",
						admin_notes: notes ?? null,
						reviewed_by: reviewerId,
						reviewed_at: new Date(),
					})
					.where(eq(contentRequests.id, numId));
			});
		} else {
			await db
				.update(contentRequests)
				.set({
					status: "declined",
					admin_notes: notes ?? null,
					reviewed_by: reviewerId,
					reviewed_at: new Date(),
				})
				.where(eq(contentRequests.id, numId));
		}

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
