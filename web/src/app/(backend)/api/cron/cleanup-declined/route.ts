import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { UPLOAD_FIELD, UPLOAD_SUBDIR } from "@/lib/api/requestData";
import { deleteUpload } from "@/lib/api/upload";
import { db } from "@/lib/db";
import { contentRequests } from "@/lib/db/schema";

interface GalleryItem {
	src?: string;
}

export async function GET(req: Request) {
	const auth = req.headers.get("authorization");
	if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({}, { status: 401 });
	}

	const declined = await db
		.select({
			id: contentRequests.id,
			type: contentRequests.type,
			data: contentRequests.data,
		})
		.from(contentRequests)
		.where(eq(contentRequests.status, "declined"));

	let filesDeleted = 0;

	for (const request of declined) {
		const data = request.data as Record<string, unknown>;

		const field = UPLOAD_FIELD[request.type];
		if (field) {
			const filename = data[field];
			if (
				typeof filename === "string" &&
				filename &&
				filename !== "undefined"
			) {
				await deleteUpload(UPLOAD_SUBDIR[request.type], filename);
				filesDeleted++;
			}
		}

		if (request.type === "gallery" && Array.isArray(data.gallery_items)) {
			for (const item of data.gallery_items as GalleryItem[]) {
				if (item.src) {
					await deleteUpload("gallery", item.src);
					filesDeleted++;
				}
			}
		}
	}

	return NextResponse.json({
		success: true,
		requestsChecked: declined.length,
		filesDeleted,
	});
}
