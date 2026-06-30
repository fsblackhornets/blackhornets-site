import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { R2_BUCKET_PRIVATE, signedGetUrl } from "@/lib/storage/r2";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const [app] = await db
			.select({ resume_path: applications.resume_path })
			.from(applications)
			.where(eq(applications.id, Number(id)));

		if (!app?.resume_path)
			return NextResponse.json({ error: "Not found" }, { status: 404 });

		// Local fallback when R2 not configured
		if (!process.env.R2_ACCOUNT_ID) {
			const origin = new URL(req.url).origin;
			const localPath = app.resume_path.startsWith("uploads/")
				? `/${app.resume_path}`
				: `/uploads/${app.resume_path}`;
			return NextResponse.redirect(`${origin}${localPath}`);
		}

		const key = app.resume_path.startsWith("uploads/")
			? app.resume_path.replace("uploads/", "")
			: app.resume_path;

		const url = await signedGetUrl(R2_BUCKET_PRIVATE, key, 300);
		return NextResponse.redirect(url);
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
