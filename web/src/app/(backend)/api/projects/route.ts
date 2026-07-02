import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { mapProjectRow } from "@/lib/api/project-mapper";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export async function GET() {
	try {
		const rows = await db
			.select()
			.from(projects)
			.orderBy(desc(projects.created_at));
		const data = rows.map(mapProjectRow);
		return NextResponse.json({ success: true, data, count: data.length });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
