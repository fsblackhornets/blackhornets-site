import type { Metadata } from "next";
import { TeamHero } from "@/components/pagecomponents/team/TeamHero";
import { TeamPageClient } from "@/components/pagecomponents/team/TeamPageClient";
import { SITE_NAME, SITE_OG_IMAGE } from "@/constants/site";
import { fetchTeamData } from "@/lib/api/team";

export const metadata: Metadata = {
	title: `Our Team — ${SITE_NAME}`,
	description:
		"Meet the talented engineers, designers and innovators behind Black Hornets Racing.",
	openGraph: {
		title: `Our Team — ${SITE_NAME}`,
		description:
			"Meet the talented engineers, designers and innovators behind Black Hornets Racing.",
		type: "website",
		siteName: SITE_NAME,
		images: [{ url: SITE_OG_IMAGE }],
	},
};

export default async function TeamPage() {
	const data = await fetchTeamData();

	return (
		<>
			<TeamHero />
			{data ? (
				<TeamPageClient data={data} />
			) : (
				<p className="text-center text-text-gray py-20">
					Could not load team data.
				</p>
			)}
		</>
	);
}
