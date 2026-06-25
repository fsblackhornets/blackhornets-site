import type { Metadata } from "next";
import { GalleryHero } from "@/components/pagecomponents/gallery/GalleryHero";
import { GalleryPageClient } from "@/components/pagecomponents/gallery/GalleryPageClient";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";
import { fetchGalleryImages, groupByCategory } from "@/lib/api/gallery";

export const metadata: Metadata = {
	title: `Gallery — ${SITE_NAME}`,
	description:
		"Photo gallery of Black Hornets Racing — race cars, team moments, competitions, and workshop photos from our Formula Student journey.",
	openGraph: {
		title: `Gallery — ${SITE_NAME}`,
		description:
			"Photo gallery of Black Hornets Racing — race cars, team moments, competitions, and workshop photos.",
		type: "website",
		siteName: SITE_NAME,
		images: [{ url: SITE_OG_IMAGE }],
	},
};

export default async function GalleryPage() {
	const images = await fetchGalleryImages();
	const grouped = groupByCategory(images);

	return (
		<>
			<GalleryHero />
			<GalleryPageClient grouped={grouped} />
		</>
	);
}
