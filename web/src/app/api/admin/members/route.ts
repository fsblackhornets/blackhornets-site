import bcrypt from "bcryptjs";
import { asc, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET() {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const data = await db
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
			.where(ne(users.role, "admin"))
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
		const required = ["username", "password", "email", "full_name"];
		for (const f of required) {
			if (!body[f])
				return NextResponse.json(
					{ error: `${f} is required` },
					{ status: 400 },
				);
		}

		const hash = await bcrypt.hash(body.password, 10);
		const [result] = await db
			.insert(users)
			.values({
				username: body.username,
				password: hash,
				email: body.email,
				full_name: body.full_name,
				role: body.role ?? "team_member",
				team: body.team ?? null,
				department: body.department ?? null,
				phone: body.phone ?? null,
				study_field: body.study_field ?? null,
				position: body.position ?? null,
				status: "active",
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json(
			{ error: "Username already taken" },
			{ status: 409 },
		);
	}
}
