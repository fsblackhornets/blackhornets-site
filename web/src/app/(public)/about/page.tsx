import type { Metadata } from "next";
import { AboutHero } from "@/components/pagecomponents/about/AboutHero";
import { DepartmentsSection } from "@/components/pagecomponents/about/DepartmentsSection";
import { MissionVisionSection } from "@/components/pagecomponents/about/MissionVisionSection";
import { OurStorySection } from "@/components/pagecomponents/about/OurStorySection";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";

export const metadata: Metadata = {
	title: `About Us — ${SITE_NAME}`,
	description:
		"Learn about Black Hornets Racing, a Formula Student team from Novi Sad. Our mission, history, and passion for motorsport engineering.",
	openGraph: {
		title: `About Us — ${SITE_NAME}`,
		description:
			"Learn about Black Hornets Racing, a Formula Student team from Novi Sad.",
		type: "website",
		siteName: SITE_NAME,
		images: [{ url: SITE_OG_IMAGE }],
	},
};

export default function AboutPage() {
	return (
		<>
			<AboutHero />
			<OurStorySection />
			<MissionVisionSection />
			<DepartmentsSection />
		</>
	);
}
