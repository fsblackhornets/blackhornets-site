import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { contentRequests } from "@/lib/db/schema";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const { id } = await params;
		const [row] = await db
			.select()
			.from(contentRequests)
			.where(eq(contentRequests.id, Number(id)));
		if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ success: true, data: row });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
