import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const body = await req.json();
		const action = body.action as string;

		if (!["accept", "reject", "review"].includes(action)) {
			return NextResponse.json(
				{ error: "Invalid parameters" },
				{ status: 400 },
			);
		}

		const statusMap: Record<string, "accepted" | "rejected" | "reviewing"> = {
			accept: "accepted",
			reject: "rejected",
			review: "reviewing",
		};

		const status = statusMap[action];
		const result = await db
			.update(applications)
			.set({ status })
			.where(eq(applications.id, Number(id)));

		if (!result[0].affectedRows) {
			return NextResponse.json(
				{ error: "Application not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, status });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
