import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { teamMembers, users } from "@/lib/db/schema";

export async function POST(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;

		const [member] = await db
			.select({ user_id: teamMembers.user_id })
			.from(teamMembers)
			.where(eq(teamMembers.id, Number(id)));

		if (!member)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });

		await db
			.update(users)
			.set({ status: sql`IF(${users.status}='active','inactive','active')` })
			.where(eq(users.id, member.user_id));

		const [row] = await db
			.select({ status: users.status })
			.from(users)
			.where(eq(users.id, member.user_id));

		return NextResponse.json({ success: true, status: row?.status });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
