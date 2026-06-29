import { Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SPONSOR_TIERS } from "@/constants/sponsors";
import { fetchSponsors, groupSponsorsByTier } from "@/lib/api/sponsors";
import { TierGroup } from "./components/TierGroup";

export async function CurrentSponsorsSection() {
	const [sponsors, t] = await Promise.all([
		fetchSponsors(),
		getTranslations("sponsors.current"),
	]);
	const grouped = groupSponsorsByTier(sponsors);
	const hasSponsors = sponsors.length > 0;

	return (
		<section className="py-20 px-4">
			<div className="max-w-screen-2xl mx-auto">
				{/* Section header */}
				<div className="mb-12">
					<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary block mb-2">
						{t("label")}
					</span>
					<h2 className="font-heading font-black text-white text-2xl leading-tight">
						{t("heading")}{" "}
						<span
							style={{
								background: "linear-gradient(90deg, #ffd700, #ffc107)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								backgroundClip: "text",
							}}
						>
							{t("headingGold")}
						</span>
					</h2>
				</div>

				{hasSponsors ? (
					SPONSOR_TIERS.map((tier) => (
						<TierGroup key={tier} tier={tier} sponsors={grouped[tier]} />
					))
				) : (
					<div className="bg-bg-dark border border-[#1e1e1e] rounded-sm p-12 text-center">
						<Clock
							size={40}
							strokeWidth={1.5}
							stroke="rgba(255,215,0,.4)"
							className="mx-auto mb-4"
							aria-hidden="true"
						/>
						<p className="font-heading text-[13px] tracking-[3px] uppercase text-primary mb-2">
							{t("comingSoon")}
						</p>
						<p className="font-body text-text-gray text-sm">
							{t("comingSoonDesc")}
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
