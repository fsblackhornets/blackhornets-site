import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { galleryImages, posts } from "@/lib/db/schema";

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

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const [post] = await db
			.select()
			.from(posts)
			.where(eq(posts.id, Number(id)));
		if (!post)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ status: "success", data: post });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const { id } = await params;
		const form = await req.formData();
		const title_sr = form.get("title_sr") as string | null;
		const content_sr = form.get("content_sr") as string | null;
		if (!title_sr || !content_sr) {
			return NextResponse.json(
				{ error: "title_sr and content_sr are required" },
				{ status: 400 },
			);
		}

		const updateData: Partial<typeof posts.$inferInsert> = {
			title: title_sr,
			title_sr,
			title_en: (form.get("title_en") as string) || null,
			content: content_sr,
			content_sr,
			content_en: (form.get("content_en") as string) || null,
			category: (form.get("category") as string) || null,
		};

		const imageFile = form.get("image") as File | null;
		if (imageFile?.size)
			updateData.image = await saveUpload(imageFile, "posts");

		await db
			.update(posts)
			.set(updateData)
			.where(eq(posts.id, Number(id)));

		await mirrorGalleryItems(parseGalleryItems(form.get("gallery_items")));

		return NextResponse.json({ status: "success", message: "Post updated" });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const { id } = await params;
		const result = await db.delete(posts).where(eq(posts.id, Number(id)));
		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ status: "success", message: "Post deleted" });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}
