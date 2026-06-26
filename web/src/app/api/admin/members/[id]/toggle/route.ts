import { and, eq, ne, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const result = await db
			.update(users)
			.set({ status: sql`IF(${users.status}='active','inactive','active')` })
			.where(and(eq(users.id, Number(id)), ne(users.role, "admin")));

		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });

		const [row] = await db
			.select({ status: users.status })
			.from(users)
			.where(eq(users.id, Number(id)));
		return NextResponse.json({ success: true, status: row?.status });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
