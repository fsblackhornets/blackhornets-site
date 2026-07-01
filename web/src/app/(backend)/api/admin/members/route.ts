import bcrypt from "bcryptjs";
import { asc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { teamMembers, users } from "@/lib/db/schema";

export async function GET() {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const data = await db
			.select({
				id: teamMembers.id,
				user_id: teamMembers.user_id,
				full_name: users.full_name,
				email: users.email,
				phone: users.phone,
				role: users.role,
				status: users.status,
				position: teamMembers.position,
				department: teamMembers.department,
				team: teamMembers.team,
				profile_picture: teamMembers.profile_picture,
				created_at: teamMembers.created_at,
			})
			.from(teamMembers)
			.innerJoin(users, eq(teamMembers.user_id, users.id))
			.orderBy(asc(users.full_name));

		return NextResponse.json({ data });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const form = await req.formData();
		const full_name = form.get("full_name") as string | null;
		if (!full_name)
			return NextResponse.json(
				{ error: "full_name is required" },
				{ status: 400 },
			);

		const email =
			(form.get("email") as string | null) ??
			`member_${Date.now()}@blackhornets.local`;
		const username = `${email.split("@")[0]}_${Date.now()}`;
		const password = await bcrypt.hash(
			Math.random().toString(36).slice(2, 10),
			10,
		);

		const [{ id: userId }] = await db
			.insert(users)
			.values({
				username,
				password,
				email,
				full_name,
				role: ((form.get("role") as string | null) ??
					"team_member") as typeof users.$inferInsert.role,
				team: (form.get("team") as string | null) || null,
				department: (form.get("department") as string | null) || null,
				phone: (form.get("phone") as string | null) || null,
				status: "active",
				study_field: (form.get("study_field") as string | null) || null,
				position: (form.get("position") as string | null) || null,
			})
			.$returningId();

		let profile_picture: string | null = null;
		const imageFile = form.get("profile_picture") as File | null;
		if (imageFile?.size)
			profile_picture = `${username}/${await saveUpload(imageFile, `members/${username}`)}`;

		const [result] = await db
			.insert(teamMembers)
			.values({
				user_id: userId,
				team: (form.get("team") as string | null) || null,
				department: (form.get("department") as string | null) || null,
				study_field: (form.get("study_field") as string | null) || null,
				position: (form.get("position") as string | null) || null,
				profile_picture,
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
