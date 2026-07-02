import { asc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
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

		let profile_picture: string | null = null;
		const imageFile = form.get("profile_picture") as File | null;
		if (imageFile?.size)
			profile_picture = await saveUpload(imageFile, "members");

		const [result] = await db
			.insert(teamMembers)
			.values({
				full_name,
				email: (form.get("email") as string | null) || null,
				phone: (form.get("phone") as string | null) || null,
				role: ((form.get("role") as string | null) ??
					"team_member") as typeof teamMembers.$inferInsert.role,
				status: "active",
				team: (form.get("team") as string | null) || null,
				department: (form.get("department") as string | null) || null,
				study_field: (form.get("study_field") as string | null) || null,
				faculty: (form.get("faculty") as string | null) || null,
				academic_year: (form.get("academic_year") as string | null) || null,
				position: (form.get("position") as string | null) || null,
				profile_picture,
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
