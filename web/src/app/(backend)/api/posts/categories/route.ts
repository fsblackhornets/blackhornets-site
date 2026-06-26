import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export async function GET() {
	try {
		const rows = await db
			.selectDistinct({ category: posts.category })
			.from(posts)
			.where(sql`${posts.category} IS NOT NULL AND ${posts.category} != ''`);
		const data = rows.map((r) => r.category).filter(Boolean);
		return NextResponse.json({ status: "success", data });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}
