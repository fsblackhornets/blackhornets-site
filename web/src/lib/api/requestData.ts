import { saveUpload } from "@/lib/api/upload";

const UPLOAD_SUBDIR: Record<string, string> = {
	post: "posts",
	project: "projects",
	sponsor: "sponsors",
	member: "profiles",
};

/**
 * Turns a manager-request FormData into the JSON blob stored on
 * content_requests.data. Uploads any File fields to R2/disk instead of
 * discarding them (previously only the original filename was kept, so
 * approved requests referenced files that were never actually saved).
 */
export async function buildRequestData(
	form: FormData,
	type: string,
): Promise<Record<string, unknown>> {
	const data: Record<string, unknown> = {};
	const galleryFiles: File[] = [];

	for (const [key, val] of form.entries()) {
		if (key.startsWith("_") || key === "type") continue;

		if (val instanceof File) {
			if (!val.size) continue;
			if (key === "images") {
				galleryFiles.push(val);
			} else {
				data[key] = await saveUpload(val, UPLOAD_SUBDIR[type] ?? "misc");
			}
		} else if (key === "gallery_items" && typeof val === "string") {
			try {
				data[key] = JSON.parse(val);
			} catch {
				data[key] = [];
			}
		} else {
			data[key] = val;
		}
	}

	if (galleryFiles.length) {
		const category = (data.category as string) ?? "team";
		const alt = (data.alt_text as string) || null;
		const caption = (data.title as string) || null;
		data.gallery_items = await Promise.all(
			galleryFiles.map(async (file) => ({
				src: await saveUpload(file, "gallery"),
				galleryCategory: category,
				alt,
				caption,
			})),
		);
	}

	return data;
}
