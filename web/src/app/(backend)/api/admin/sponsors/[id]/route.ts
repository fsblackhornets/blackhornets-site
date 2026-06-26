import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const [sponsor] = await db
			.select()
			.from(sponsors)
			.where(eq(sponsors.id, Number(id)));
		if (!sponsor)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ success: true, data: sponsor });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const form = await req.formData();
		for (const f of ["name", "description", "tier"]) {
			if (!form.get(f))
				return NextResponse.json(
					{ error: `Field '${f}' is required.` },
					{ status: 400 },
				);
		}

		const updateData: Partial<typeof sponsors.$inferInsert> = {
			name: (form.get("name") as string).trim(),
			description: (form.get("description") as string).trim(),
			description_en: ((form.get("description_en") as string) ?? "").trim(),
			tier: form.get("tier") as string,
			website: ((form.get("website") as string) ?? "").trim(),
			tier_order: Number(form.get("tier_order") ?? 1),
		};

		const logoFile = form.get("logo") as File | null;
		if (logoFile?.size)
			updateData.logo = await saveUpload(logoFile, "sponsors");

		await db
			.update(sponsors)
			.set(updateData)
			.where(eq(sponsors.id, Number(id)));
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const result = await db.delete(sponsors).where(eq(sponsors.id, Number(id)));
		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
