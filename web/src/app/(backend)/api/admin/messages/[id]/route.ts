import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const result = await db
			.delete(contactMessages)
			.where(eq(contactMessages.id, Number(id)));
		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ success: true, message: "Message deleted" });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
