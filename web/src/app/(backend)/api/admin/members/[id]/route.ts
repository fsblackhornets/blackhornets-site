import { eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

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
		if (!(await requireAdmin())) return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const body = await req.json();

		const result = await db
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
				image_position: body.image_position ?? "50% 50%",
				...(body.profile_picture
					? { profile_picture: body.profile_picture as string }
					: {}),
			})
			.where(eq(teamMembers.id, Number(id)));

		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		if (!(await requireAdmin())) return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const form = await req.formData();

		const memberUpdate: Partial<typeof teamMembers.$inferInsert> = {
			full_name: (form.get("full_name") as string) || undefined,
			email: (form.get("email") as string | null) || null,
			phone: (form.get("phone") as string | null) || null,
			role: ((form.get("role") as string | null) ??
				"team_member") as typeof teamMembers.$inferInsert.role,
			team: (form.get("team") as string | null) || null,
			department: (form.get("department") as string | null) || null,
			study_field: (form.get("study_field") as string | null) || null,
			faculty: (form.get("faculty") as string | null) || null,
			academic_year: (form.get("academic_year") as string | null) || null,
			position: (form.get("position") as string | null) || null,
			image_position:
				(form.get("image_position") as string | null) || "50% 50%",
		};

		const imageFile = form.get("profile_picture") as File | null;
		if (imageFile?.size)
			memberUpdate.profile_picture = await saveUpload(imageFile, "members");

		const result = await db
			.update(teamMembers)
			.set(memberUpdate)
			.where(eq(teamMembers.id, Number(id)));

		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Member not found" }, { status: 404 });

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
