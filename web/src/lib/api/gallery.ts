import { apiGet } from "@/lib/api-client";
import type { GalleryImage } from "@/types/gallery";

interface GalleryResponse {
	success: boolean;
	data: GalleryImage[];
}

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
	try {
		const res = await apiGet<GalleryResponse>("gallery", {
			next: { revalidate: 300 },
		});
		return res.data ?? [];
	} catch {
		return [];
	}
}

export function groupByCategory(
	images: GalleryImage[],
): Record<string, GalleryImage[]> {
	return images.reduce<Record<string, GalleryImage[]>>((acc, img) => {
		if (!acc[img.category]) acc[img.category] = [];
		acc[img.category].push(img);
		return acc;
	}, {});
}
