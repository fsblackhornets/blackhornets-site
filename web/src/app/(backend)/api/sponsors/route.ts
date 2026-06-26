import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";

export async function GET() {
	try {
		const data = await db
			.select()
			.from(sponsors)
			.orderBy(asc(sponsors.tier_order), asc(sponsors.name));
		return NextResponse.json({ success: true, data, count: data.length });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
