import { asc, eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
	try {
		const category = req.nextUrl.searchParams.get("category");
		const query = db
			.select()
			.from(galleryImages)
			.where(
				category
					? sql`${galleryImages.is_active} = 1 AND ${galleryImages.category} = ${category}`
					: eq(galleryImages.is_active, 1),
			)
			.orderBy(asc(galleryImages.sort_order), asc(galleryImages.created_at));
		const data = await query;
		return NextResponse.json({ success: true, data, count: data.length });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const form = await req.formData();
		const image = form.get("image") as File | null;
		if (!image)
			return NextResponse.json({ error: "No image uploaded" }, { status: 400 });

		const category = (form.get("category") as string) ?? "team";
		const title = (form.get("title") as string) ?? "";
		if (!category)
			return NextResponse.json(
				{ error: "Category is required" },
				{ status: 400 },
			);

		const filename = await saveUpload(image, "gallery");
		const [result] = await db
			.insert(galleryImages)
			.values({
				image_path: filename,
				category,
				title: title || null,
				created_by: Number(session.user.id),
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
