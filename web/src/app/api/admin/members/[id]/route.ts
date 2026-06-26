import { and, eq, ne, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

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
			.select({
				id: users.id,
				username: users.username,
				email: users.email,
				full_name: users.full_name,
				role: users.role,
				team: users.team,
				department: users.department,
				phone: users.phone,
				study_field: users.study_field,
				position: users.position,
				profile_picture: users.profile_picture,
				status: users.status,
				created_at: users.created_at,
			})
			.from(users)
			.where(eq(users.id, Number(id)));

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
			.update(users)
			.set({
				email: body.email,
				full_name: body.full_name,
				role: body.role ?? "team_member",
				team: body.team ?? null,
				department: body.department ?? null,
				phone: body.phone ?? null,
				study_field: body.study_field ?? null,
				position: body.position ?? null,
			})
			.where(and(eq(users.id, Number(id)), ne(users.role, "admin")));

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
			.delete(users)
			.where(and(eq(users.id, Number(id)), ne(users.role, "admin")));
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
