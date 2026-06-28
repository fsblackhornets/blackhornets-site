import { type SponsorTier, TIER_LABELS } from "@/constants/sponsors";
import type { Sponsor } from "@/types/sponsor";
import { SponsorCard } from "./SponsorCard";

const TIER_TEXT: Record<SponsorTier, string> = {
	Institucija: "text-purple-400",
	"F1 - Platinum": "text-slate-300",
	"F2 - Gold": "text-primary",
	"F3 - Silver": "text-gray-400",
	"F4 - Bronze": "text-orange-400",
	"Friends of the Project": "text-primary/60",
};

const TIER_BADGE: Record<SponsorTier, { border: string; bg: string }> = {
	Institucija: { border: "border-purple-400/30", bg: "bg-purple-400/5" },
	"F1 - Platinum": { border: "border-slate-300/30", bg: "bg-slate-300/5" },
	"F2 - Gold": { border: "border-primary/30", bg: "bg-primary/5" },
	"F3 - Silver": { border: "border-gray-400/30", bg: "bg-gray-400/5" },
	"F4 - Bronze": { border: "border-orange-400/30", bg: "bg-orange-400/5" },
	"Friends of the Project": { border: "border-primary/20", bg: "bg-primary/5" },
};

const TIER_BORDER: Record<SponsorTier, string> = {
	Institucija: "border-t-purple-400/40",
	"F1 - Platinum": "border-t-slate-300/40",
	"F2 - Gold": "border-t-primary/60",
	"F3 - Silver": "border-t-gray-400/40",
	"F4 - Bronze": "border-t-orange-400/40",
	"Friends of the Project": "border-t-primary/20",
};

export function TierGroup({
	tier,
	sponsors,
}: {
	tier: SponsorTier;
	sponsors: Sponsor[];
}) {
	if (sponsors.length === 0) return null;

	const textCls = TIER_TEXT[tier];
	const badge = TIER_BADGE[tier];
	const borderCls = TIER_BORDER[tier];

	return (
		<div className="mb-10">
			{/* Divider row */}
			<div className="flex items-center gap-4 mb-6">
				<div className="flex-1 h-px bg-[#1e1e1e]" />
				<span
					style={{
						clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
					}}
					className={`inline-block px-4 py-1 border ${badge.border} ${badge.bg} font-heading text-[8px] tracking-[4px] uppercase ${textCls}`}
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
