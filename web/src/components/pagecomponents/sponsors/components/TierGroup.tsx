import { type SponsorTier, TIER_LABELS } from "@/constants/sponsors";
import type { Sponsor } from "@/types/sponsor";
import { SponsorCard } from "./SponsorCard";

export function TierGroup({
	tier,
	sponsors,
}: {
	tier: SponsorTier;
	sponsors: Sponsor[];
}) {
	if (sponsors.length === 0) return null;

	return (
		<div className="mb-12">
			<h3 className="font-heading text-lg tracking-widest text-primary uppercase mb-6 text-center">
				{TIER_LABELS[tier]}
			</h3>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
				{sponsors.map((sponsor) => (
					<SponsorCard key={sponsor.id} sponsor={sponsor} />
				))}
			</div>
		</div>
	);
}
