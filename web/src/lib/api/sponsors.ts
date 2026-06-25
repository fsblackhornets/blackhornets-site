import {
	SPONSOR_TIERS,
	type SponsorTier,
	TIER_KEYWORDS,
} from "@/constants/sponsors";
import { apiGet } from "@/lib/api-client";
import type { Sponsor } from "@/types/sponsor";

interface SponsorsResponse {
	success: boolean;
	data: Sponsor[];
}

export async function fetchSponsors(): Promise<Sponsor[]> {
	try {
		const res = await apiGet<SponsorsResponse>("sponsors", {
			next: { revalidate: 300 },
		});
		return res.data ?? [];
	} catch {
		return [];
	}
}

export function groupSponsorsByTier(
	sponsors: Sponsor[],
): Record<SponsorTier, Sponsor[]> {
	const grouped = Object.fromEntries(
		SPONSOR_TIERS.map((t) => [t, [] as Sponsor[]]),
	) as Record<SponsorTier, Sponsor[]>;

	for (const sponsor of sponsors) {
		const raw = sponsor.tier.trim().toLowerCase();
		const match = TIER_KEYWORDS.find((rule) =>
			rule.keywords.some((kw) => raw.includes(kw)),
		);
		const key: SponsorTier = match ? match.tier : "F1 - Platinum";
		grouped[key].push(sponsor);
	}

	return grouped;
}
