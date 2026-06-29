import { and, desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { contentRequests } from "@/lib/db/schema";

export async function GET(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const sp = req.nextUrl.searchParams;
		const role = sp.get("_role") ?? session.user.role;
		const userId =
			role !== "admin" ? Number(sp.get("_user_id") ?? session.user.id) : null;
		const status = sp.get("status");
		const type = sp.get("type");

		const conditions = [];
		if (userId) conditions.push(eq(contentRequests.submitted_by, userId));
		if (status && status !== "all")
			conditions.push(
				eq(
					contentRequests.status,
					status as "pending" | "approved" | "declined",
				),
			);
		if (type && type !== "all")
			conditions.push(
				eq(
					contentRequests.type,
					type as "post" | "project" | "sponsor" | "member",
				),
			);

		const rows = await db
			.select()
			.from(contentRequests)
			.where(conditions.length ? and(...conditions) : undefined)
			.orderBy(desc(contentRequests.created_at));

		return NextResponse.json({ success: true, data: rows });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const form = await req.formData();
		const type = form.get("type") as string;
		const userId = Number(form.get("_user_id") ?? session.user.id);
		const submitterName =
			(form.get("_user_name") as string) ?? session.user.full_name ?? "";

		const data: Record<string, unknown> = {};
		for (const [key, val] of form.entries()) {
			if (!key.startsWith("_") && key !== "type") {
				data[key] = val instanceof File ? val.name : val;
			}
		}

		const [result] = await db
			.insert(contentRequests)
			.values({
				type: type as "post" | "project" | "sponsor" | "member" | "gallery",
				data,
				submitted_by: userId,
				submitter_name: submitterName,
				status: "pending",
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
