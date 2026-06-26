import { desc, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? 1));
		const limit = 10;
		const offset = (page - 1) * limit;

		const [[{ total }], data] = await Promise.all([
			db.select({ total: sql<number>`COUNT(*)` }).from(contactMessages),
			db
				.select()
				.from(contactMessages)
				.orderBy(desc(contactMessages.created_at))
				.limit(limit)
				.offset(offset),
		]);

		return NextResponse.json({
			data,
			total: Number(total),
			page,
			total_pages: Math.max(1, Math.ceil(Number(total) / limit)),
		});
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
