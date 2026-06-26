import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const [project] = await db
			.select()
			.from(projects)
			.where(eq(projects.id, Number(id)));
		if (!project)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ success: true, data: project });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const form = await req.formData();
		const required = ["name", "status", "due_date", "duration"];
		for (const f of required) {
			if (!form.get(f))
				return NextResponse.json(
					{ error: `Field '${f}' is required.` },
					{ status: 400 },
				);
		}

		const updateData: Partial<typeof projects.$inferInsert> = {
			name: (form.get("name") as string).trim(),
			description: ((form.get("description") as string) ?? "").trim(),
			status: form.get("status") as string,
			due_date: form.get("due_date") as string,
			duration: (form.get("duration") as string).trim(),
			progress: Number(form.get("progress") ?? 0),
		};

		const imageFile = form.get("image") as File | null;
		if (imageFile?.size)
			updateData.image = await saveUpload(imageFile, "projects");

		await db
			.update(projects)
			.set(updateData)
			.where(eq(projects.id, Number(id)));
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const { id } = await params;
		const result = await db.delete(projects).where(eq(projects.id, Number(id)));
		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
