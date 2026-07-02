import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { mapProjectRow } from "@/lib/api/project-mapper";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const [project] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, Number(id)));
		if (!project)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ success: true, data: mapProjectRow(project) });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
