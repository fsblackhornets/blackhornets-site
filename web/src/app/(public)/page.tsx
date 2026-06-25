import type { Metadata } from "next";
import { HeroSection } from "@/components/pagecomponents/home/HeroSection";
import { LatestNewsSection } from "@/components/pagecomponents/home/LatestNewsSection";
import { WhoWeAreSection } from "@/components/pagecomponents/home/WhoWeAreSection";
import { SITE_DESCRIPTION, SITE_NAME } from "@/constants/site";

export const metadata: Metadata = {
	title: `${SITE_NAME} | Formula Student Novi Sad`,
	description: SITE_DESCRIPTION,
	openGraph: {
		title: `${SITE_NAME} | Formula Student Novi Sad`,
		description: SITE_DESCRIPTION,
		type: "website",
		siteName: SITE_NAME,
	},
};

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<div className="px-4">
				<LatestNewsSection />
				<WhoWeAreSection />
			</div>
		</>
	);
}
