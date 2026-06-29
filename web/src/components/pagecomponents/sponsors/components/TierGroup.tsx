import {
	type SponsorTier,
	TIER_LABELS,
	TIER_STYLES,
} from "@/constants/sponsors";
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

	const {
		text: textCls,
		badgeBorder,
		badgeBg,
		border: borderCls,
	} = TIER_STYLES[tier];

	return (
		<div className="mb-10">
			{/* Divider row */}
			<div className="flex items-center gap-4 mb-6">
				<div className="flex-1 h-px bg-[#1e1e1e]" />
				<span
					style={{
						clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
					}}
					className={`inline-block px-4 py-1 border ${badgeBorder} ${badgeBg} font-heading text-[8px] tracking-[4px] uppercase ${textCls}`}
				>
					{TIER_LABELS[tier]}
				</span>
				<div className="flex-1 h-px bg-[#1e1e1e]" />
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
				{sponsors.map((sponsor) => (
					<SponsorCard
						key={sponsor.id}
						sponsor={sponsor}
						tierColor={borderCls}
					/>
				))}
			</div>
		</div>
	);
}
