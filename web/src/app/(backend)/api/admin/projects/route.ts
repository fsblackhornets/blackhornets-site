import { desc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export async function GET() {
	try {
		const session = await auth();
		if (session?.user?.role !== "admin")
			return NextResponse.json({}, { status: 403 });

		const data = await db
			.select()
			.from(projects)
			.orderBy(desc(projects.created_at));
		return NextResponse.json({ success: true, data, count: data.length });
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
		const required = ["name", "status", "due_date", "duration"];
		for (const f of required) {
			if (!form.get(f))
				return NextResponse.json(
					{ error: `Field '${f}' is required.` },
					{ status: 400 },
				);
		}

		let image: string | null = null;
		const imageFile = form.get("image") as File | null;
		if (imageFile?.size) image = await saveUpload(imageFile, "projects");

		const [result] = await db
			.insert(projects)
			.values({
				name: (form.get("name") as string).trim(),
				description: ((form.get("description") as string) ?? "").trim(),
				status: form.get("status") as string,
				due_date: form.get("due_date") as string,
				duration: (form.get("duration") as string).trim(),
				progress: Number(form.get("progress") ?? 0),
				image,
			})
			.$returningId();

		return NextResponse.json({ success: true, id: result.id }, { status: 201 });
	} catch {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
