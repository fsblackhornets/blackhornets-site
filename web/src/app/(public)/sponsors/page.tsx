import type { Metadata } from "next";
import { BecomeSponsorSection } from "@/components/pagecomponents/sponsors/BecomeSponsorSection";
import { CurrentSponsorsSection } from "@/components/pagecomponents/sponsors/CurrentSponsorsSection";
import { SponsorsHero } from "@/components/pagecomponents/sponsors/SponsorsHero";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";

export const metadata: Metadata = {
	title: `Sponsors — ${SITE_NAME}`,
	description:
		"Our sponsors and partners who support Black Hornets Racing. Learn how you can sponsor a Formula Student team from Novi Sad.",
	openGraph: {
		title: `Sponsors — ${SITE_NAME}`,
		description: "Our sponsors and partners who support Black Hornets Racing.",
		type: "website",
		siteName: SITE_NAME,
		images: [{ url: SITE_OG_IMAGE }],
	},
};

export default function SponsorsPage() {
	return (
		<>
			<SponsorsHero />
			<CurrentSponsorsSection />
			<BecomeSponsorSection />
		</>
	);
}
