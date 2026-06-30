import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveUpload } from "@/lib/api/upload";
import { R2_PUBLIC_URL } from "@/lib/storage/r2";

export async function POST(req: NextRequest) {
	try {
		const session = await auth();
		if (!session?.user) return NextResponse.json({}, { status: 401 });

		const form = await req.formData();
		const file = form.get("file") as File | null;
		if (!file?.size)
			return NextResponse.json({ error: "No file provided" }, { status: 400 });

		const filename = await saveUpload(file, "posts");
		const url = R2_PUBLIC_URL
			? `${R2_PUBLIC_URL}/posts/${filename}`
			: `/uploads/posts/${filename}`;

		return NextResponse.json({ url });
	} catch {
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}
