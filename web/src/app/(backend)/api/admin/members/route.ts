import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

export async function GET() {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const data = await db
			.select()
			.from(teamMembers)
			.orderBy(asc(teamMembers.full_name));

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
			return NextResponse.json({ error: "full_name is required" }, { status: 400 });

		const [result] = await db
			.insert(teamMembers)
			.values({
				full_name: body.full_name,
				email: body.email ?? null,
				phone: body.phone ?? null,
				role: body.role ?? "team_member",
				team: body.team ?? null,
				department: body.department ?? null,
				study_field: body.study_field ?? null,
				position: body.position ?? null,
				status: "active",
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
