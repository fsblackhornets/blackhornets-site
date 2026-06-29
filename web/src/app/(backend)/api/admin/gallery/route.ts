import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";

export async function GET() {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const data = await db
			.select()
			.from(galleryImages)
			.orderBy(asc(galleryImages.sort_order), asc(galleryImages.created_at));
		return NextResponse.json({ success: true, data });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
