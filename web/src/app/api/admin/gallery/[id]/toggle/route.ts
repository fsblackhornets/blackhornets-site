import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";

export async function POST(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const result = await db
			.update(galleryImages)
			.set({ is_active: sql`IF(${galleryImages.is_active}=1,0,1)` })
			.where(eq(galleryImages.id, Number(id)));

		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Image not found" }, { status: 404 });

		const [img] = await db
			.select({ is_active: galleryImages.is_active })
			.from(galleryImages)
			.where(eq(galleryImages.id, Number(id)));
		return NextResponse.json({ success: true, is_active: img?.is_active });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
