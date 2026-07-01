import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { galleryImages, posts } from "@/lib/db/schema";

export async function GET() {
	try {
		const data = await db
			.select()
			.from(posts)
			.where(eq(posts.status, "published"))
			.orderBy(desc(posts.created_at));
		return NextResponse.json({ status: "success", data });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}

interface GalleryItem {
	src: string;
	galleryCategory?: string;
	alt?: string;
	caption?: string;
}

function parseGalleryItems(raw: FormDataEntryValue | null): GalleryItem[] {
	if (typeof raw !== "string") return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

async function mirrorGalleryItems(items: GalleryItem[]) {
	for (const item of items) {
		if (item.src && item.galleryCategory && item.galleryCategory !== "none") {
			await db.insert(galleryImages).values({
				image_path: item.src,
				category: item.galleryCategory,
				alt_text: item.alt || null,
				title: item.caption || null,
				is_active: 1,
			});
		}
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const form = await req.formData();
		const title_sr = form.get("title_sr") as string | null;
		const content_sr = form.get("content_sr") as string | null;
		if (!title_sr || !content_sr) {
			return NextResponse.json(
				{ error: "title_sr and content_sr are required" },
				{ status: 400 },
			);
		}

		const imageFile = form.get("image") as File | null;
		const image = imageFile?.size ? await saveUpload(imageFile, "posts") : null;

		const [result] = await db
			.insert(posts)
			.values({
				title: title_sr,
				title_sr,
				title_en: (form.get("title_en") as string) || null,
				content: content_sr,
				content_sr,
				content_en: (form.get("content_en") as string) || null,
				category: (form.get("category") as string) || null,
				author: session.user.full_name ?? "Admin",
				image,
				status: "published",
			})
			.$returningId();

		await mirrorGalleryItems(parseGalleryItems(form.get("gallery_items")));

		return NextResponse.json(
			{ status: "success", id: result.id },
			{ status: 201 },
		);
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}
