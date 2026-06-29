import bcrypt from "bcryptjs";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
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

export async function POST(req: Request) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const body = await req.json();
		if (!body.full_name)
			return NextResponse.json(
				{ error: "full_name is required" },
				{ status: 400 },
			);

		const email = body.email ?? `member_${Date.now()}@blackhornets.local`;
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
				full_name: body.full_name,
				role: body.role ?? "team_member",
				team: body.team ?? null,
				department: body.department ?? null,
				phone: body.phone ?? null,
				status: "active",
				study_field: body.study_field ?? null,
				position: body.position ?? null,
			})
			.$returningId();

		const [result] = await db
			.insert(teamMembers)
			.values({
				user_id: userId,
				team: body.team ?? null,
				department: body.department ?? null,
				study_field: body.study_field ?? null,
				position: body.position ?? null,
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
