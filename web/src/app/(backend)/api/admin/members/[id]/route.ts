import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { teamMembers, users } from "@/lib/db/schema";

async function requireAdmin() {
	const session = await auth();
	return session?.user?.role === "admin";
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		if (!(await requireAdmin())) return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const [row] = await db
			.select({
				id: teamMembers.id,
				user_id: teamMembers.user_id,
				full_name: users.full_name,
				email: users.email,
				phone: users.phone,
				role: users.role,
				status: users.status,
				position: teamMembers.position,
				position_en: teamMembers.position_en,
				academic_year: teamMembers.academic_year,
				study_field: teamMembers.study_field,
				faculty: teamMembers.faculty,
				department: teamMembers.department,
				team: teamMembers.team,
				age: teamMembers.age,
				date_of_birth: teamMembers.date_of_birth,
				profile_picture: teamMembers.profile_picture,
				image_position: teamMembers.image_position,
				motivation: teamMembers.motivation,
				skills: teamMembers.skills,
				projects: teamMembers.projects,
				achievements: teamMembers.achievements,
				created_at: teamMembers.created_at,
			})
			.from(teamMembers)
			.innerJoin(users, eq(teamMembers.user_id, users.id))
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
		if (!(await requireAdmin())) return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const body = await req.json();

		const [member] = await db
			.select({ user_id: teamMembers.user_id })
			.from(teamMembers)
			.where(eq(teamMembers.id, Number(id)));

		if (!member)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });

		await Promise.all([
			db
				.update(users)
				.set({
					full_name: body.full_name,
					email: body.email ?? undefined,
					phone: body.phone ?? null,
					role: body.role ?? "team_member",
				})
				.where(eq(users.id, member.user_id)),
			db
				.update(teamMembers)
				.set({
					team: body.team ?? null,
					department: body.department ?? null,
					study_field: body.study_field ?? null,
					position: body.position ?? null,
				})
				.where(eq(teamMembers.id, Number(id))),
		]);

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
		if (!(await requireAdmin())) return NextResponse.json({}, { status: 403 });

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
		if (!(await requireAdmin())) return NextResponse.json({}, { status: 403 });

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
