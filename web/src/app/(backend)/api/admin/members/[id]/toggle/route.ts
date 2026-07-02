import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

export async function POST(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;

		await db
			.update(teamMembers)
			.set({
				status: sql`IF(${teamMembers.status}='active','inactive','active')`,
			})
			.where(eq(teamMembers.id, Number(id)));

		const [row] = await db
			.select({ status: teamMembers.status })
			.from(teamMembers)
			.where(eq(teamMembers.id, Number(id)));

		if (!row)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });

		return NextResponse.json({ success: true, status: row.status });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
