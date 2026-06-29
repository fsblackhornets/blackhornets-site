import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const result = await db
			.delete(galleryImages)
			.where(eq(galleryImages.id, Number(id)));
		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Image not found" }, { status: 404 });
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const body = await req.json();
		await db
			.update(galleryImages)
			.set({ title: body.title ?? null, category: body.category ?? "team" })
			.where(eq(galleryImages.id, Number(id)));
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
