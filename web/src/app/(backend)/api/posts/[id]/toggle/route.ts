import { eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export async function POST(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const { id } = await params;
		await db
			.update(posts)
			.set({ status: sql`IF(${posts.status}='published','draft','published')` })
			.where(eq(posts.id, Number(id)));

		const [post] = await db
			.select({ status: posts.status })
			.from(posts)
			.where(eq(posts.id, Number(id)));
		if (!post)
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json({ status: "success", new_status: post.status });
	} catch {
		return NextResponse.json({ status: "error" }, { status: 500 });
	}
}
