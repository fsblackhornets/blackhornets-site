import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";

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
			.from(applications)
			.where(eq(applications.id, Number(id)));
		if (!row)
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 },
			);
		return NextResponse.json({ data: row });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
