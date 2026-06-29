import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
	try {
		const lang = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "sr";
		const key = `brochure_pdf_${lang}`;
		const [row] = await db
			.select()
			.from(siteSettings)
			.where(eq(siteSettings.setting_key, key));
		if (!row) {
			return NextResponse.json({
				success: false,
				data: null,
				message: "No brochure uploaded yet",
			});
		}
		return NextResponse.json({
			success: true,
			data: { lang, path: row.setting_value },
		});
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
