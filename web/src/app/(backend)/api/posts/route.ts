import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export async function GET() {
	try {
		const data = await db
			.select()
			.from(posts)
			.where(eq(posts.status, "published"))
			.orderBy(desc(posts.created_at));
		return NextResponse.json({ status: "success", data });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const body = await req.json();
		if (!body.title_sr || !body.content_sr) {
			return NextResponse.json(
				{ error: "title_sr and content_sr are required" },
				{ status: 400 },
			);
		}

		const [result] = await db
			.insert(posts)
			.values({
				title: body.title_sr,
				title_sr: body.title_sr,
				title_en: body.title_en ?? null,
				content: body.content_sr,
				content_sr: body.content_sr,
				content_en: body.content_en ?? null,
				category: body.category ?? null,
				author: session.user.full_name ?? "Admin",
				image: body.image ?? null,
				status: "published",
			})
			.$returningId();

		return NextResponse.json(
			{ status: "success", id: result.id },
			{ status: 201 },
		);
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}
