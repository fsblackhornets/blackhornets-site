import { asc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";

export async function GET() {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const data = await db
			.select()
			.from(sponsors)
			.orderBy(asc(sponsors.tier_order), asc(sponsors.name));
		return NextResponse.json({ success: true, data, count: data.length });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const form = await req.formData();
		for (const f of ["name", "description", "tier"]) {
			if (!form.get(f))
				return NextResponse.json(
					{ error: `Field '${f}' is required.` },
					{ status: 400 },
				);
		}

		let logo: string | null = null;
		const logoFile = form.get("logo") as File | null;
		if (logoFile?.size) logo = await saveUpload(logoFile, "sponsors");

		const [result] = await db
			.insert(sponsors)
			.values({
				name: (form.get("name") as string).trim(),
				description: (form.get("description") as string).trim(),
				description_en: ((form.get("description_en") as string) ?? "").trim(),
				tier: form.get("tier") as string,
				website: ((form.get("website") as string) ?? "").trim(),
				tier_order: Number(form.get("tier_order") ?? 1),
				logo,
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
