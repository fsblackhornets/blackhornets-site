import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const [row] = await db
			.select()
			.from(teamMembers)
			.where(eq(teamMembers.id, Number(id)));

		if (!row)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });
		return NextResponse.json({ data: row });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const body = await req.json();
		await db
			.update(teamMembers)
			.set({
				full_name: body.full_name,
				email: body.email ?? null,
				phone: body.phone ?? null,
				role: body.role ?? "team_member",
				team: body.team ?? null,
				department: body.department ?? null,
				study_field: body.study_field ?? null,
				position: body.position ?? null,
			})
			.where(eq(teamMembers.id, Number(id)));

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const result = await db
			.delete(teamMembers)
			.where(eq(teamMembers.id, Number(id)));
		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function PATCH(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const result = await db
			.update(teamMembers)
			.set({ status: sql`IF(${teamMembers.status}='active','inactive','active')` })
			.where(eq(teamMembers.id, Number(id)));
		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });

		const [row] = await db
			.select({ status: teamMembers.status })
			.from(teamMembers)
			.where(eq(teamMembers.id, Number(id)));
		return NextResponse.json({ success: true, status: row?.status });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
