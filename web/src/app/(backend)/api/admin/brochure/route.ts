import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export async function GET() {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const [sr, en] = await Promise.all([
			db
				.select()
				.from(siteSettings)
				.where(eq(siteSettings.setting_key, "brochure_pdf_sr")),
			db
				.select()
				.from(siteSettings)
				.where(eq(siteSettings.setting_key, "brochure_pdf_en")),
		]);

		return NextResponse.json({
			success: true,
			data: {
				sr: sr[0] ? { lang: "sr", path: sr[0].setting_value } : null,
				en: en[0] ? { lang: "en", path: en[0].setting_value } : null,
			},
		});
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
		const lang = form.get("lang") === "en" ? "en" : "sr";
		const file = form.get("brochure_pdf") as File | null;

		if (!file?.size)
			return NextResponse.json({ error: "No PDF uploaded." }, { status: 400 });
		if (file.size > 20 * 1024 * 1024)
			return NextResponse.json(
				{ error: "File too large (max 20 MB)." },
				{ status: 400 },
			);
		if (!file.name.toLowerCase().endsWith(".pdf"))
			return NextResponse.json(
				{ error: "Only PDF files are accepted." },
				{ status: 400 },
			);

		const path = await saveUpload(file, "brochure");
		const key = `brochure_pdf_${lang}`;

		await db
			.insert(siteSettings)
			.values({
				setting_key: key,
				setting_value: path,
				updated_by: Number(session.user.id),
			})
			.onDuplicateKeyUpdate({
				set: { setting_value: path, updated_by: Number(session.user.id) },
			});

		return NextResponse.json({ success: true, lang, path });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
