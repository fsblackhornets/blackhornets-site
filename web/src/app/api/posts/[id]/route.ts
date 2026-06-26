import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const [post] = await db
			.select()
			.from(posts)
			.where(eq(posts.id, Number(id)));
		if (!post)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ status: "success", data: post });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const { id } = await params;
		const body = await req.json();
		if (!body.title_sr || !body.content_sr) {
			return NextResponse.json(
				{ error: "title_sr and content_sr are required" },
				{ status: 400 },
			);
		}

		await db
			.update(posts)
			.set({
				title: body.title_sr,
				title_sr: body.title_sr,
				title_en: body.title_en ?? null,
				content: body.content_sr,
				content_sr: body.content_sr,
				content_en: body.content_en ?? null,
				category: body.category ?? null,
				image: body.image ?? null,
			})
			.where(eq(posts.id, Number(id)));

		return NextResponse.json({ status: "success", message: "Post updated" });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const { id } = await params;
		const result = await db.delete(posts).where(eq(posts.id, Number(id)));
		if (!result[0].affectedRows)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ status: "success", message: "Post deleted" });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}
